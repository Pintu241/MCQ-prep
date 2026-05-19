# ═══════════════════════════════════════════════════════════════
#  Terraform — AWS Infrastructure for MCQ-prep
#
#  What this creates:
#    • VPC with public subnet
#    • Security group (firewall rules)
#    • EC2 instance running Amazon Linux 2 (for Node.js backend)
#    • S3 bucket (for React frontend static files)
#    • IAM role so EC2 can pull secrets from SSM
#
#  Run order:
#    terraform init       ← Download AWS provider
#    terraform plan       ← Preview what will be created
#    terraform apply      ← Actually create resources
#    terraform destroy    ← Tear everything down
# ═══════════════════════════════════════════════════════════════

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.5.0"
}

# ── Provider: Tell Terraform to use AWS in ap-south-1 (Mumbai, closest to Ludhiana)
provider "aws" {
  region = var.aws_region
}

# ─────────────────────────────────────────────
# VARIABLES  (override in terraform.tfvars)
# ─────────────────────────────────────────────
variable "aws_region" {
  default = "ap-south-1"
  description = "AWS region to deploy to"
}

variable "app_name" {
  default = "mcq-prep"
}

variable "ec2_instance_type" {
  default = "t3.micro"    # Free tier eligible
}

variable "your_ip" {
  description = "Your public IP for SSH access — run: curl ifconfig.me"
  type        = string
}

# ─────────────────────────────────────────────
# NETWORKING
# ─────────────────────────────────────────────

# VPC = your private network on AWS
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"   # 65,536 IP addresses
  enable_dns_hostnames = true
  tags = { Name = "${var.app_name}-vpc" }
}

# Subnet = a slice of the VPC (public = reachable from internet)
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"
  tags = { Name = "${var.app_name}-public-subnet" }
}

# Internet Gateway = the door between your VPC and the internet
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.app_name}-igw" }
}

# Route table = tells traffic where to go
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"               # All traffic
    gateway_id = aws_internet_gateway.igw.id  # Goes out to internet
  }
  tags = { Name = "${var.app_name}-rt" }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# ─────────────────────────────────────────────
# SECURITY GROUP (Firewall rules)
# ─────────────────────────────────────────────
resource "aws_security_group" "backend" {
  name   = "${var.app_name}-backend-sg"
  vpc_id = aws_vpc.main.id

  # Allow SSH only from your IP (not the whole internet!)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${var.your_ip}/32"]
  }

  # Allow Node.js API traffic
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow HTTPS (for later when you add a domain)
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic (to install packages, reach MongoDB Atlas etc.)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.app_name}-backend-sg" }
}

# ─────────────────────────────────────────────
# EC2 INSTANCE (your backend server)
# ─────────────────────────────────────────────

# Key pair — create this first: ssh-keygen -t rsa -b 4096 -f ~/.ssh/mcq-prep-key
resource "aws_key_pair" "mcq_key" {
  key_name   = "${var.app_name}-key"
  public_key = file("~/.ssh/mcq-prep-key.pub")
}

# Find the latest Amazon Linux 2023 AMI automatically
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

resource "aws_instance" "backend" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.ec2_instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.backend.id]
  key_name               = aws_key_pair.mcq_key.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  # User data = commands that run when EC2 first boots
  user_data = <<-EOF
    #!/bin/bash
    # Install Docker
    yum update -y
    yum install -y docker git
    systemctl start docker
    systemctl enable docker
    usermod -a -G docker ec2-user

    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
      -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

    # Install Node.js 18
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs

    echo "Bootstrap complete" >> /var/log/user-data.log
  EOF
   root_block_device {
    volume_size = 20
  }
  tags = { Name = "${var.app_name}-backend" }
}

# ─────────────────────────────────────────────
# S3 BUCKET (React frontend static files)
# ─────────────────────────────────────────────
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.app_name}-frontend-${random_id.suffix.hex}"
  tags   = { Name = "${var.app_name}-frontend" }
}

resource "random_id" "suffix" {
  byte_length = 4
}

# Allow public read access (needed to serve a website)
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.frontend.arn}/*"
    }]
  })
  depends_on = [aws_s3_bucket_public_access_block.frontend]
}

# Enable static website hosting
resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  index_document { suffix = "index.html" }
  error_document { key    = "index.html" }   # React Router handles 404s
}

# ─────────────────────────────────────────────
# IAM ROLE (lets EC2 access SSM Parameter Store)
# ─────────────────────────────────────────────
resource "aws_iam_role" "ec2_role" {
  name = "${var.app_name}-ec2-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.app_name}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

# ─────────────────────────────────────────────
# OUTPUTS (printed after terraform apply)
# ─────────────────────────────────────────────
output "backend_public_ip" {
  description = "SSH into EC2: ssh -i ~/.ssh/mcq-prep-key ec2-user@<this IP>"
  value       = aws_instance.backend.public_ip
}

output "frontend_website_url" {
  description = "Your React frontend URL (after you upload the build)"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

output "s3_bucket_name" {
  description = "Upload React build here: aws s3 sync dist/ s3://<this bucket>"
  value       = aws_s3_bucket.frontend.bucket
}

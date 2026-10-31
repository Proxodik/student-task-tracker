terraform {
  backend "s3" {
    bucket       = "horilyi-terraform-state-311681428483"
    key          = "student-task-tracker/terraform.tfstate"
    region       = "eu-north-1"
    use_lockfile = true
    encrypt      = true
  }
}

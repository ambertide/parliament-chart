
variable "gcp_billing_account" {
  type        = string
  description = "GCP Billing Account ID"
}

variable "github_pat" {
  type        = string
  description = "GitHub PAT Value GCP uses."
}

variable "github_google_cloud_build_app_id" {
  type        = string
  description = "ID of the GCP Cloud Build connector app on parlichart"
}

variable "cloudflare_api_token" {
  type        = string
  description = "Cloudflare API Key"
}

variable "zone_id" {
  type        = string
  description = "Cloudflare Zone ID"
}

variable "account_id" {
  default = "<YOUR_ACCOUNT_ID>"
}

variable "domain" {
  default = "<YOUR_DOMAIN>"
}

variable "twitter_api_key" {
  type        = string
  description = "Twitter OAuth1 Client ID"
  sensitive   = true
}

variable "twitter_api_secret" {
  type        = string
  description = "Twitter OAuth1 Client Secret"
  sensitive   = true
}

variable "twitter_access_token" {
  type        = string
  description = "Twitter OAuth1 Access Token"
  sensitive   = true
}

variable "twitter_access_token_secret" {
  type        = string
  description = "Twitter OAuth1 Access Token Secret"
  sensitive   = true
}

variable "github_ewsfp_key_value" {
  type        = string
  description = "GitHub Key for EWSfP Deployments"
  sensitive   = true
}


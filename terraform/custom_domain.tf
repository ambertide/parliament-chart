resource "google_firebase_hosting_custom_domain" "default" {
  provider = google-beta

  project       = google_project.default.project_id
  site_id       = google_firebase_hosting_site.full.site_id
  custom_domain = "parlichart.com"
}

resource "cloudflare_dns_record" "txt_record" {
  type    = "TXT"
  name    = "parlichart.com"
  ttl     = 3600
  content = "hosting-site=parlichart"
  comment = "Domain verification record"
  zone_id = var.zone_id
}

resource "cloudflare_dns_record" "a_record_apex" {
  type    = "A"
  name    = "parlichart.com"
  ttl     = 3600
  content = "199.36.158.100"
  comment = "GCP Firebase Custom Domain"
  zone_id = var.zone_id
}

resource "cloudflare_dns_record" "a_record_www" {
  type    = "A"
  name    = "www"
  ttl     = 3600
  content = "199.36.158.100"
  comment = "GCP Firebase Custom Domain"
  zone_id = var.zone_id
}

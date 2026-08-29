// Deployment for the Early Warning System for Parlichart.

/** Provisioning the secret key */
resource "google_secret_manager_secret" "github_ewsfp_key" {
  project   = google_project.default.project_id
  secret_id = "ewsfp-api-key"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "github_ewsfp_key" {
  project     = google_project.default.project_id
  secret      = google_secret_manager_secret.github_ewsfp_key.id
  secret_data = var.github_ewsfp_key_value
}

resource "google_secret_manager_secret_iam_member" "ewsfp_key_access" {
  project   = google_project.default.project_id
  secret_id = google_secret_manager_secret.github_ewsfp_key.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.default.email}"
}

/** Provisioning the cloud run containing the ewsfp image */
resource "google_cloud_run_v2_job" "default" {
  name     = "ewsfp-checkpoint"
  location = "us-central1"
  project  = google_project.default.project_id

  deletion_protection = false

  template {
    template {
      service_account = google_service_account.default.email

      containers {
        image = "ghcr.io/parlichart/ewsfp:latest"
        env {
          name = "EWSFP_GITHUB_PAT"
          value_source {
            secret_key_ref {
              secret  = google_secret_manager_secret.github_ewsfp_key.secret_id
              version = "latest"
            }
          }
        }
      }
    }
  }

  depends_on = [
    google_secret_manager_secret_iam_member.ewsfp_key_access,
  ]
}

/** Provisioning the service account for cloud scheduler */
resource "google_service_account" "default" {
  project      = google_project.default.project_id
  account_id   = "scheduler-sa"
  description  = "Cloud Scheduler service account; used to trigger scheduled Cloud Run jobs."
  display_name = "scheduler-sa"
}

resource "google_cloud_run_v2_job_iam_member" "default" {
  project  = google_project.default.project_id
  location = google_cloud_run_v2_job.default.location
  name     = google_cloud_run_v2_job.default.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.default.email}"
}

/** Add cloud scheduler job which invokes the cloud run. */
resource "google_cloud_scheduler_job" "default" {
  project          = google_project.default.project_id
  name             = "ewsfp-checkpoint-job"
  region           = "us-central1"
  description      = "Invoke a Cloud Run container with EWSfP Image"
  schedule         = "*/15 * * * *"
  time_zone        = "Europe/Istanbul"
  attempt_deadline = "320s"

  retry_config {
    retry_count = 1
  }

  http_target {
    http_method = "POST"
    uri         = "https://us-central1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/${google_project.default.project_id}/jobs/${google_cloud_run_v2_job.default.name}:run"

    oauth_token {
      service_account_email = google_service_account.default.email
    }
  }
}

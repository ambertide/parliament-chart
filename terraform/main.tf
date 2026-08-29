# Creates a new Google Cloud project.
resource "google_project" "default" {
  provider = google-beta.no_user_project_override

  name       = "Parlichart"
  project_id = "parlichart-main"
  # Required for any service that requires the Blaze pricing plan
  # (like Firebase Authentication with GCIP)
  billing_account = var.gcp_billing_account

  # Required for the project to display in any list of Firebase projects.
  labels = {
    "firebase" = "enabled"
  }
}

# Enables required APIs.
resource "google_project_service" "default" {
  provider = google-beta.no_user_project_override
  project  = google_project.default.project_id
  for_each = toset([
    "cloudbilling.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "firebase.googleapis.com",
    # Enabling the ServiceUsage API allows the new project to be quota checked from now on.
    "serviceusage.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudbuild.googleapis.com",
    "cloudscheduler.googleapis.com",
    "run.googleapis.com"
  ])
  service = each.key

  # Don't disable the service if the resource block is removed by accident.
  disable_on_destroy = false
}

# Enables Firebase services for the new project created above.
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.default.project_id

  # Waits for the required APIs to be enabled.
  depends_on = [
    google_project_service.default
  ]
}

# Below we enable the web hosting

resource "google_firebase_web_app" "default" {
  provider     = google-beta
  project      = google_project.default.project_id
  display_name = "Main frontend, statically built, with firebase"
}

resource "google_firebase_hosting_site" "full" {
  provider = google-beta
  project  = google_project.default.project_id
  site_id  = "parlichart-main-website"
  app_id   = google_firebase_web_app.default.app_id
}

# GitHub Connection

resource "google_secret_manager_secret" "github_token_secret" {
  project   = google_project.default.project_id
  secret_id = "parlichart_github_gcp_deployment_pat"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "twitter_api_key" {
  project   = google_project.default.project_id
  secret_id = "TWITTER_API_KEY"
  replication {
    auto {

    }
  }
}


resource "google_secret_manager_secret" "twitter_api_secret" {
  project   = google_project.default.project_id
  secret_id = "TWITTER_API_SECRET"
  replication {
    auto {

    }
  }
}
resource "google_secret_manager_secret" "twitter_access_token" {
  project   = google_project.default.project_id
  secret_id = "TWITTER_ACCESS_TOKEN"
  replication {
    auto {

    }
  }
}
resource "google_secret_manager_secret" "twitter_access_token_secret" {
  project   = google_project.default.project_id
  secret_id = "TWITTER_ACCESS_TOKEN_SECRET"
  replication {
    auto {

    }
  }
}


resource "google_service_account" "ghtrigger_service_account" {
  project      = google_project.default.project_id
  account_id   = "cloudbuild-github-agent"
  display_name = "Cloud Build GitHub Service Account"
}

resource "google_project_iam_member" "ghtrigger_service_account_roles" {
  project = google_project.default.project_id
  role    = "roles/cloudbuild.builds.builder"
  member  = "serviceAccount:${google_service_account.ghtrigger_service_account.email}"
}


resource "google_project_iam_member" "ghtrigger_service_account_firebase_role" {
  project = google_project.default.project_id
  role    = "roles/firebase.admin"
  member  = "serviceAccount:${google_service_account.ghtrigger_service_account.email}"
}
resource "google_secret_manager_secret_version" "github_token_secret_version" {
  secret      = google_secret_manager_secret.github_token_secret.id
  secret_data = var.github_pat
}

resource "google_secret_manager_secret_version" "twitter_api_key_version" {
  secret      = google_secret_manager_secret.twitter_api_key.id
  secret_data = var.twitter_api_key
}

resource "google_secret_manager_secret_version" "twitter_api_secret_version" {
  secret      = google_secret_manager_secret.twitter_api_secret.id
  secret_data = var.twitter_api_secret
}

resource "google_secret_manager_secret_version" "twitter_acces_token_version" {
  secret      = google_secret_manager_secret.twitter_access_token.id
  secret_data = var.twitter_access_token
}

resource "google_secret_manager_secret_version" "twitter_access_token_secret_version" {
  secret      = google_secret_manager_secret.twitter_access_token_secret.id
  secret_data = var.twitter_access_token_secret
}

data "google_iam_policy" "serviceagent_secretAccessor" {
  binding {
    role    = "roles/secretmanager.secretAccessor"
    members = ["serviceAccount:${google_service_account.ghtrigger_service_account.email}"]
  }
}

resource "google_secret_manager_secret_iam_policy" "policy" {
  project     = google_secret_manager_secret.github_token_secret.project
  secret_id   = google_secret_manager_secret.github_token_secret.secret_id
  policy_data = data.google_iam_policy.serviceagent_secretAccessor.policy_data
}

resource "google_secret_manager_secret_iam_policy" "policy_2" {
  project     = google_secret_manager_secret.twitter_api_key.project
  secret_id   = google_secret_manager_secret.twitter_api_key.secret_id
  policy_data = data.google_iam_policy.serviceagent_secretAccessor.policy_data
}

resource "google_secret_manager_secret_iam_policy" "policy_3" {
  project     = google_secret_manager_secret.twitter_api_secret.project
  secret_id   = google_secret_manager_secret.twitter_api_secret.secret_id
  policy_data = data.google_iam_policy.serviceagent_secretAccessor.policy_data
}

resource "google_secret_manager_secret_iam_policy" "policy_4" {
  project     = google_secret_manager_secret.twitter_access_token.project
  secret_id   = google_secret_manager_secret.twitter_access_token.secret_id
  policy_data = data.google_iam_policy.serviceagent_secretAccessor.policy_data
}

resource "google_secret_manager_secret_iam_policy" "policy_5" {
  project     = google_secret_manager_secret.twitter_access_token_secret.project
  secret_id   = google_secret_manager_secret.twitter_access_token_secret.secret_id
  policy_data = data.google_iam_policy.serviceagent_secretAccessor.policy_data
}

// Create the GitHub connection
resource "google_cloudbuildv2_connection" "parlichart_connection" {
  project  = google_project.default.project_id
  location = "us-east1"
  name     = "parlichart_gcp_github_connection"

  github_config {
    app_installation_id = var.github_google_cloud_build_app_id
    authorizer_credential {
      oauth_token_secret_version = google_secret_manager_secret_version.github_token_secret_version.id
    }
  }
  depends_on = [
    google_secret_manager_secret_iam_policy.policy,
    google_secret_manager_secret_iam_policy.policy_2,
    google_secret_manager_secret_iam_policy.policy_3,
    google_secret_manager_secret_iam_policy.policy_4,
    google_secret_manager_secret_iam_policy.policy_5,
  ]
}

resource "google_cloudbuildv2_repository" "parlichart_repo" {
  project           = google_project.default.project_id
  location          = "us-east1"
  name              = "parliament-chart"
  parent_connection = google_cloudbuildv2_connection.parlichart_connection.name
  remote_uri        = "https://github.com/parlichart/parlichart.git"
}

resource "google_cloudbuild_trigger" "parlichart_on_push" {
  location = "us-east1"
  project  = google_project.default.project_id
  repository_event_config {
    repository = google_cloudbuildv2_repository.parlichart_repo.id
    push {
      branch = "main"
    }
  }

  service_account = google_service_account.ghtrigger_service_account.id
  filename        = "cloudbuild.yml"
  depends_on = [
    google_secret_manager_secret_iam_policy.policy,
    google_secret_manager_secret_iam_policy.policy_2,
    google_secret_manager_secret_iam_policy.policy_3,
    google_secret_manager_secret_iam_policy.policy_4,
    google_secret_manager_secret_iam_policy.policy_5,
  ]
}

resource "random_id" "default" {
  byte_length = 8
}

resource "google_storage_bucket" "default" {
  project  = "parlichart-main"
  name     = "${random_id.default.hex}-terraform-remote-backend"
  location = "us-east1"

  force_destroy               = false
  public_access_prevention    = "enforced"
  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }
}

resource "local_file" "default" {
  file_permission = "0644"
  filename        = "${path.module}/backend.tf"

  # You can store the template in a file and use the templatefile function for
  # more modularity, if you prefer, instead of storing the template inline as
  # we do here.
  content = <<-EOT
  terraform {
    backend "gcs" {
      bucket = "${google_storage_bucket.default.name}"
    }
  }
  EOT
}


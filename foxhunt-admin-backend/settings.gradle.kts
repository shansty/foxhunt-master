rootProject.name = "foxhunt-admin-backend"
include(":fox-hunt-domain", ":email-service")
project(":fox-hunt-domain").projectDir = file("../fox-hunt-domain")
project(":email-service").projectDir = file("../email-service")

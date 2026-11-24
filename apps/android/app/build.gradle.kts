plugins {
    id("com.android.application") version "9.2.1"
    id("org.jetbrains.kotlin.plugin.compose") version "2.2.10"
}

val legacyDebugKey = rootProject.file("debug.keystore")

android {
    namespace = "dev.shantanusuthar.portfolio"
    compileSdk = 37

    defaultConfig {
        applicationId = "dev.shantanusuthar.portfolio"
        minSdk = 26
        targetSdk = 36
        val baseVersion = "1.0"
        versionCode = System.getenv("VERSION_CODE")?.toIntOrNull() ?: 1
        versionName = System.getenv("VERSION_NAME")?.ifBlank { null } ?: baseVersion
    }

    // Reuse the earlier local debug certificate when upgrading an Expo debug install.
    if (legacyDebugKey.isFile) {
        signingConfigs.getByName("debug") {
            storeFile = legacyDebugKey
            storePassword = "android"
            keyAlias = "androiddebugkey"
            keyPassword = "android"
        }
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation("androidx.core:core-splashscreen:1.0.1")
    implementation("androidx.activity:activity-compose:1.10.1")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.8.7")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
    implementation("androidx.compose.material3:material3:1.5.0")
    implementation("androidx.compose.material:material-icons-core:1.7.8")
    implementation("androidx.compose.material:material-icons-extended:1.7.8")
}

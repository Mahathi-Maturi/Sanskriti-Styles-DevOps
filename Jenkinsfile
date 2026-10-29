
pipeline {
    agent any

    tools {
        jdk 'JDK21'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Mahathi-Maturi/Sanskriti-Styles-DevOps.git'
            }
        }

        stage('Build') {
            steps {
                bat 'mvnw.cmd clean package -DskipTests'
            }
        }

        stage('Test') {
            steps {
                bat 'mvnw.cmd test'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t sanskriti-styles:v1 .'
            }
        }
    }

    post {
        success {
            echo 'Sanskriti Styles CI pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}


pipeline {
    agent any

    tools {
        jdk 'JDK21'
    }

    environment {
        DOCKER = 'C:\\Users\\mahat\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe'
        KUBECTL = 'C:\\Users\\mahat\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\kubectl.exe'
        KUBECONFIG = 'C:\\Users\\mahat\\.kube\\config'

        IMAGE = "sanskriti-styles:build-${BUILD_NUMBER}"
        ARCHIVE = "sanskriti-${BUILD_NUMBER}.tar"
        LOADER = "sanskriti-loader-${BUILD_NUMBER}"
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
                bat '"%DOCKER%" build -t %IMAGE% .'
            }
        }

        stage('Save Docker Image') {
            steps {
                bat '"%DOCKER%" save -o %ARCHIVE% %IMAGE%'
            }
        }

        stage('Create Image Loader') {
            steps {
                bat '"%KUBECTL%" --kubeconfig="%KUBECONFIG%" run %LOADER% --image=busybox:1.36 --restart=Never --overrides="{\\"spec\\":{\\"containers\\":[{\\"name\\":\\"loader\\",\\"image\\":\\"busybox:1.36\\",\\"command\\":[\\"sleep\\",\\"1800\\"],\\"securityContext\\":{\\"privileged\\":true},\\"volumeMounts\\":[{\\"name\\":\\"host\\",\\"mountPath\\":\\"/host\\"}]}],\\"volumes\\":[{\\"name\\":\\"host\\",\\"hostPath\\":{\\"path\\":\\"/\\"}}]}}"'

                bat '"%KUBECTL%" --kubeconfig="%KUBECONFIG%" wait --for=condition=Ready pod/%LOADER% --timeout=120s'
            }
        }

        stage('Transfer Docker Image') {
            steps {
                bat '"%KUBECTL%" --kubeconfig="%KUBECONFIG%" cp %ARCHIVE% default/%LOADER%:/tmp/%ARCHIVE% -c loader'
            }
        }

        stage('Import Image into Kubernetes') {
            steps {
                bat '"%KUBECTL%" --kubeconfig="%KUBECONFIG%" exec %LOADER% -c loader -- cp /tmp/%ARCHIVE% /host/tmp/%ARCHIVE%'

                bat '"%KUBECTL%" --kubeconfig="%KUBECONFIG%" exec %LOADER% -c loader -- chroot /host ctr -n k8s.io images import /tmp/%ARCHIVE%'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat '"%KUBECTL%" --kubeconfig="%KUBECONFIG%" set image deployment/sanskriti-deployment sanskriti-container=%IMAGE%'
            }
        }

        stage('Verify Deployment') {
            steps {
                bat '"%KUBECTL%" --kubeconfig="%KUBECONFIG%" rollout status deployment/sanskriti-deployment --timeout=180s'

                bat '"%KUBECTL%" --kubeconfig="%KUBECONFIG%" get pods'
            }
        }
    }

    post {
        always {
            bat 'if exist "%ARCHIVE%" del "%ARCHIVE%"'

            bat '"%KUBECTL%" --kubeconfig="%KUBECONFIG%" delete pod %LOADER% --ignore-not-found=true --wait=false'
        }

        success {
            echo 'Sanskriti Styles CI/CD pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}

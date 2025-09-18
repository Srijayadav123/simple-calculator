pipeline {
  agent any

  environment {
    REGISTRY = "docker.io"
    DOCKER_REPO = "your-dockerhub-username/simple-calculator"
    DOCKER_CRED = "dockerhub-cred-id"
    KUBE_CONFIG_CRED = "kubeconfig-cred-id"
    TAG = "${env.BUILD_NUMBER}"
    K8S_DIR = "k8s"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install Dependencies') {
      steps { sh 'cd backend && npm ci' }
    }

    stage('Build Docker Image') {
      steps { sh "docker build -t ${DOCKER_REPO}:${TAG} ." }
    }

    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: env.DOCKER_CRED, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh "docker push ${DOCKER_REPO}:${TAG}"
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        withKubeConfig([credentialsId: env.KUBE_CONFIG_CRED]) {
          script {
            def exists = sh(script: "kubectl get deployment simple-calculator --ignore-not-found", returnStdout: true).trim()
            if (exists) {
              sh "kubectl set image deployment/simple-calculator calculator=${DOCKER_REPO}:${TAG} --record"
            } else {
              sh "sed -i 's#REPLACE_TAG#${TAG}#g' ${K8S_DIR}/deployment.yaml"
              sh "kubectl apply -f ${K8S_DIR}/"
            }
            sh "kubectl rollout status deployment/simple-calculator --timeout=120s"
          }
        }
      }
    }
  }

  post {
    success { echo "Deployed ${DOCKER_REPO}:${TAG} successfully" }
    failure { echo "Pipeline failed" }
  }
}


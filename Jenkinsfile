pipeline {
    agent any

    stages {
        stage('Test pipeline') {
            steps {
                echo "🚀 Jenkins fonctionne sur la branche ${env.BRANCH_NAME} !"
                echo "🌟 Jenkinsfile exécuté avec succès !"
                sh 'echo Hello from Jenkins'
            }
        }
    }
}

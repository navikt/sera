def mvnHome, mvn, nodeHome, npm, node // tools
def committer, lastcommit, releaseVersion // metadata
def application = "sera"
def dockerDir = "./docker"
def distDir = "${dockerDir}/dist"

pipeline {
    agent label: ""

    stages {
        stage("checkout") {
            git url: "ssh://git@stash.devillo.no:7999/aura/${application}.git"
        }

        stage("initialize") {
            script {
                mvnHome = tool "maven-3.3.9"
                mvn = "${mvnHome}/bin/mvn"
                nodeHome = tool "nodejs-6.6.0"
                npm = "${nodeHome}/bin/npm"
                node = "${nodeHome}/bin/node"

                releaseVersion = sh(
                        script: 'npm version major | cut -d"v" -f2',
                        returnStdout: true
                ).trim()

                // aborts pipeline if releaseVersion already is released
                sh "if [ \$(curl -s -o /dev/null -I -w \"%{http_code}\" http://maven.adeo.no/m2internal/no/nav/aura/${application}/${application}/${releaseVersion}) != 404 ]; then echo \"this version is somehow already released, manually update to a unreleased SNAPSHOT version\"; exit 1; fi"

                committer = sh(
                        script: 'git log -1 --pretty=format:"%ae (%an)"',
                        returnStdout: true
                ).trim()


                lastcommit = sh(
                        script: 'git log -1 --pretty=format:"%ae (%an) %h %s" --no-merges',
                        returnStdout: true
                ).trim()
            }
        }

        stage("npm install") { //
            withEnv(['HTTP_PROXY=http://webproxy-utvikler.nav.no:8088', 'NO_PROXY=adeo.no']) {
                sh "${npm} install"
            }
        }

        stage("create version") {
            script {
                sh "${mvn} versions:set -f app-config/pom.xml -DgenerateBackupPoms=false -B -DnewVersion=${releaseVersion}"
                sh "git commit -am \"set version to ${releaseVersion} (from Jenkins pipeline)\""
                sh "git push origin master"
                sh "git tag -a ${application}-${releaseVersion} -m ${application}-${releaseVersion}"
                sh "git push --tags"
            }
        }

        stage("Include backend and server.js") {
            sh "mkdir -p ${distDir}"
            sh "cp -r server.js api ${distDir}"
        }

        stage("build frontend bundle") {
            script {
                sh "cd ${distDir} && cp ../../package.json . && npm install --production && cd -" // getting required node_modules for production
                sh "npm install &&  node ./node_modules/gulp/bin/gulp.js dist || exit 1" // Creating frontend bundle
                sh "cp -r dist ${dockerDir}" // Copying frontend bundle
                sh "cp Dockerfile ${dockerDir}"
            }
        }

        stage("build and publish docker image") {
            script {
                def imageName = "docker.adeo.no:5000/${application}:${releaseVersion}"
                sh "sudo docker build -t ${imageName} ./docker"
                sh "sudo docker push ${imageName}"
            }
        }

        stage("publish app-config artifact") {
            sh "${mvn} clean deploy -f app-config/pom.xml -DskipTests -B -e"
        }

        stage("jilease") {
            withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'jiraServiceUser', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                sh "/usr/bin/jilease -jiraUrl http://jira.adeo.no -project AURA -application ${application} -version $releaseVersion -username $env.USERNAME -password $env.PASSWORD"
            }
        }

        stage("deploy") {
            withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'srvauraautodeploy', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                sh "${mvn} aura:deploy -Dapps=${application}:${releaseVersion} -Denv=cd-u1 -Dusername=${env.USERNAME} -Dpassword=${env.PASSWORD} -Dorg.slf4j.simpleLogger.log.no.nav=debug -B -Ddebug=true -e"
            }
        }
    }
}


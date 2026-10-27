@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------
@IF "%DEBUG%" == "" @ECHO OFF
@SETLOCAL EnableExtensions EnableDelayedExpansion

SET "DIRNAME=%~dp0"
IF "%DIRNAME%" == "" SET "DIRNAME=."

SET "WRAPPER_JAR=%DIRNAME%\.mvn\wrapper\maven-wrapper.jar"
SET "WRAPPER_PROP=%DIRNAME%\.mvn\wrapper\maven-wrapper.properties"

IF NOT "%JAVA_HOME%" == "" (
    SET "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
) ELSE (
    SET "JAVA_EXE=java.exe"
)

IF EXIST "%WRAPPER_JAR%" (
    "%JAVA_EXE%" -Dfile.encoding=UTF-8 -jar "%WRAPPER_JAR%" %*
    EXIT /B %ERRORLEVEL%
)

@REM Auto-download wrapper jar or maven distribution using PowerShell if needed
SET "MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.9"
IF EXIST "%MAVEN_HOME%\bin\mvn.cmd" (
    CALL "%MAVEN_HOME%\bin\mvn.cmd" %*
    EXIT /B %ERRORLEVEL%
)

ECHO Downloading Apache Maven 3.9.9...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; New-Item -ItemType Directory -Force -Path '%USERPROFILE%\.m2\wrapper\dists' | Out-Null; $zip = '%USERPROFILE%\.m2\wrapper\dists\maven.zip'; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.9/apache-maven-3.9.9-bin.zip' -OutFile $zip; Expand-Archive -Path $zip -DestinationPath '%USERPROFILE%\.m2\wrapper\dists' -Force; Remove-Item $zip"

IF EXIST "%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.9\bin\mvn.cmd" (
    CALL "%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.9\bin\mvn.cmd" %*
    EXIT /B %ERRORLEVEL%
)

ECHO Error: Could not find or download Maven.
EXIT /B 1

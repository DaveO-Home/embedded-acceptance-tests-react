@echo off


if "%1" == "" (
    goto error
)    
if "%2" == "" (
    goto error 
)    

pushd "%~dp0"

cd %1\build && gulp %2

popd
goto end

:error
echo Enter a bundler and gulp task

:end

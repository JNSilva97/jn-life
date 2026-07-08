@echo off
REM Pull the latest app files from Google Drive, commit, and push to GitHub Pages.
set SRC=C:\Users\jnsil\My Drive\Projects\JN Life
set DST=%~dp0

copy /Y "%SRC%\JN_Life_APP.html" "%DST%index.html"
copy /Y "%SRC%\JN_Life_APP.js"   "%DST%JN_Life_APP.js"
copy /Y "%SRC%\JN_Life_APP.css"  "%DST%JN_Life_APP.css"
copy /Y "%SRC%\manifest.json"    "%DST%manifest.json"
copy /Y "%SRC%\sw.js"            "%DST%sw.js"
copy /Y "%SRC%\icon.png"         "%DST%icon.png"
copy /Y "%SRC%\icon-512.png"     "%DST%icon-512.png"

cd /d "%~dp0"
git add -A
git commit -m "Update app"
git push

echo.
echo Deployed! Phones pick up the new version next time they open the app online.
pause

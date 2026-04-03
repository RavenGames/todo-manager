@echo off
echo Deploying Todo Manager App to GitHub Pages...
echo.

REM Initialize git repository if not already done
if not exist .git (
    git init
    git add .
    git commit -m "Initial commit - Todo Manager App"
)

REM Add all changes
git add .

REM Commit changes
git commit -m "Update Todo Manager App with optimizations"

REM Deploy instructions
echo.
echo To deploy to GitHub Pages:
echo 1. Create a new repository on GitHub named 'todo-manager'
echo 2. Run: git remote add origin https://github.com/yourusername/todo-manager.git
echo 3. Run: git push -u origin main
echo 4. Enable GitHub Pages in repository settings -> Pages -> Source: Deploy from a branch -> Branch: main
echo.
echo Your app will be available at: https://yourusername.github.io/todo-manager/

pause
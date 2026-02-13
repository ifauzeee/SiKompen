@echo off
SETLOCAL EnableDelayedExpansion

:: --- CONFIGURATION ---
SET PROJECT_NAME=SiKompen
SET BIN_DIR=bin
SET MAIN_GO=cmd/api/main.go

:: --- DYNAMIC ESCAPE CHARACTER GENERATION (Agar warna jalan saat copy-paste) ---
for /F "tokens=1,2 delims=#" %%a in ('"prompt #$H#$E# & echo on & for %%b in (1) do rem"') do (
  set "ESC=%%b"
)

:: --- COLOR CODES ---
SET GREEN=%ESC%[92m
SET YELLOW=%ESC%[93m
SET RED=%ESC%[91m
SET BLUE=%ESC%[94m
SET CYAN=%ESC%[96m
SET RESET=%ESC%[0m

:: --- COMMAND DISPATCHER ---
if "%1"=="dev" goto dev
if "%1"=="frontend" goto frontend
if "%1"=="backend" goto backend
if "%1"=="build" goto build
if "%1"=="fmt" goto fmt
if "%1"=="lint" goto lint
if "%1"=="test" goto test
if "%1"=="check" goto check
if "%1"=="fix" goto fix
if "%1"=="tidy" goto tidy
if "%1"=="docker-up" goto docker-up
if "%1"=="docker-down" goto docker-down
if "%1"=="clean" goto clean
goto help

:help
echo %CYAN%Usage: run.bat [command]%RESET%
echo.
echo %YELLOW%Code Quality ^& Maintenance:%RESET%
echo   %GREEN%fix%RESET%         Format all files AND tidy modules (All-in-one fix)
echo   %GREEN%check%RESET%       Run lint, fmt check, and tests (All-in-one quality check)
echo   %GREEN%fmt%RESET%         Format all files (Frontend and Backend)
echo   %GREEN%lint%RESET%        Run linting (uses golangci-lint if avail, else go vet)
echo   %GREEN%test%RESET%        Run all tests
echo.
echo %YELLOW%Development:%RESET%
echo   %GREEN%dev%RESET%         Run both Frontend and Backend
echo   %GREEN%frontend%RESET%    Run Next.js dev server
echo   %GREEN%backend%RESET%     Run Go backend (uses 'air' if avail for hot-reload)
echo   %GREEN%build%RESET%       Build both Frontend and Backend
echo   %GREEN%tidy%RESET%        Run go mod tidy
echo   %GREEN%docker-up%RESET%   Run docker-compose up
echo   %GREEN%docker-down%RESET% Run docker-compose down
echo   %GREEN%clean%RESET%       Clean build artifacts
exit /b 0

:fix
echo %BLUE%--- Running All-in-One Fix ---%RESET%
echo %BLUE%--- Formatting Frontend ---%RESET%
call pnpm exec prettier --write .
echo %BLUE%--- Formatting Backend ---%RESET%
go fmt ./...
echo %BLUE%--- Cleaning Up Go Modules ---%RESET%
go mod tidy
echo %GREEN%✅ Fix complete!%RESET%
exit /b 0

:check
echo %BLUE%--- Running All-in-One Quality Check ---%RESET%
echo %BLUE%[1/3] Running Linting...%RESET%
echo %BLUE%--- Linting Frontend ---%RESET%
call pnpm lint
if %ERRORLEVEL% NEQ 0 (echo %RED%❌ Frontend lint failed%RESET% & exit /b 1)

echo %BLUE%--- Linting Backend ---%RESET%
:: Cek apakah golangci-lint terinstall
where golangci-lint >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    golangci-lint run
) else (
    echo %YELLOW%golangci-lint not found, falling back to go vet...%RESET%
    go vet ./...
)
if %ERRORLEVEL% NEQ 0 (echo %RED%❌ Backend lint failed%RESET% & exit /b 1)

echo %BLUE%[2/3] Running Formatting Check...%RESET%
:: Disini kita format ulang saja biar aman
call pnpm exec prettier --write .
go fmt ./...

echo %BLUE%[3/3] Running Tests...%RESET%
echo %BLUE%--- Running Backend Tests ---%RESET%
go test ./internal/...
if %ERRORLEVEL% NEQ 0 (echo %RED%❌ Tests failed%RESET% & exit /b 1)
echo %GREEN%✅ All quality checks passed! Project is healthy.%RESET%
exit /b 0

:dev
echo %BLUE%--- Starting Full Stack Development Mode ---%RESET%
:: Start backend in new window
start "Backend API" cmd /c "run.bat backend"
:: Start frontend in current window
goto frontend

:frontend
echo %BLUE%--- Starting Frontend (Next.js) ---%RESET%
call pnpm dev
exit /b 0

:backend
echo %BLUE%--- Starting Backend (Go) ---%RESET%
:: Cek apakah 'air' terinstall untuk hot-reload
where air >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo %GREEN%Using 'air' for live reload...%RESET%
    air
) else (
    echo %YELLOW%'air' not found. Installing recommended: go install github.com/air-verse/air@latest%RESET%
    echo %YELLOW%Running with standard 'go run'...%RESET%
    go run %MAIN_GO%
)
exit /b 0

:build
echo %BLUE%--- Building Backend ---%RESET%
if not exist %BIN_DIR% mkdir %BIN_DIR%
:: Tambahkan .exe karena ini Windows script
go build -o %BIN_DIR%/server.exe %MAIN_GO%
echo %BLUE%--- Building Frontend ---%RESET%
call pnpm build
exit /b 0

:fmt
echo %BLUE%--- Formatting Frontend ---%RESET%
call pnpm exec prettier --write .
echo %BLUE%--- Formatting Backend ---%RESET%
go fmt ./...
exit /b 0

:lint
echo %BLUE%--- Linting Frontend ---%RESET%
call pnpm lint
echo %BLUE%--- Linting Backend ---%RESET%
where golangci-lint >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    golangci-lint run
) else (
    go vet ./...
)
exit /b 0

:test
echo %BLUE%--- Running Backend Tests ---%RESET%
go test ./internal/...
exit /b 0

:tidy
echo %BLUE%--- Cleaning Up Go Modules ---%RESET%
go mod tidy
exit /b 0

:docker-up
echo %BLUE%--- Starting Docker Containers ---%RESET%
docker-compose --env-file .env up --build
exit /b 0

:docker-down
echo %BLUE%--- Stopping Docker Containers ---%RESET%
docker-compose down
exit /b 0

:clean
echo %BLUE%--- Cleaning Build Artifacts ---%RESET%
if exist %BIN_DIR% rd /s /q %BIN_DIR%
if exist .next rd /s /q .next
echo %GREEN%Deleted %BIN_DIR% and .next folders%RESET%
exit /b 0
#!/bin/bash
echo "Building the backend..."
cd ..
cd backend/AlexBotAPI
dotnet publish -c Release -o ../publish # build the .NET app in release mode
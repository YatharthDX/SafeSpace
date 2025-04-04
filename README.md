# Project Setup and Start Guide  

This guide explains how to set up and run the project, including backend, chat-backend, and frontend.  

## **1. Initial Setup**  

### **Backend Setup**  
1. Navigate to the backend folder:  
   ```bash
   cd backend
   ```  
2. Create and activate a virtual environment:  
   ```bash
   python3 -m venv venv  
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate  
   ```  
3. Install dependencies:  
   ```bash
   pip install -r requirements.txt  
   ```  
4. Move back to the root directory:  
   ```bash
   cd ..
   ```  

### **Chat-Backend Setup**  
1. Navigate to the chat-backend folder:  
   ```bash
   cd chat-backend
   ```  
2. Install dependencies:  
   ```bash
   npm install  
   ```  
3. Move back to the root directory:  
   ```bash
   cd ..
   ```  

### **Frontend Setup**  
1. Navigate to the frontend folder:  
   ```bash
   cd frontend
   ```  
2. Install dependencies:  
   ```bash
   npm install  
   ```  
3. Move back to the root directory:  
   ```bash
   cd ..
   ```  

## **2. Running the Project**  

After the initial setup, run the project using:  
```bash
./start.sh
```  

The script will:  
✅ Start the FastAPI backend.  
✅ Start the chat-backend service.  
✅ Start the frontend application.  

## **3. Notes**  
- Ensure Python and Node.js are installed before running the setup.  
- If you encounter permission issues, try:  
  ```bash
  chmod +x start.sh
  ```  
- Stop the servers using `CTRL + C`.  

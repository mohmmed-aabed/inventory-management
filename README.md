# Inventory Management

This repository implements Inventory Management System using Express.js and MongoDB.

This Application is designed to track both purchases and sales and to calculate the following numbers:

•	Total Purchases

•	Total Sales

•	Total Profit

•	Stock Value (Considering the average purchase price)

When you open the home page, the previous numbers will be calculated (from the beginning of current month to the current day). This can be changed to any dates required.

The application assumes that products will be distributed through 5 different sales points (buses), so the application can track all sales and profits done by these different buses individually.

Since the purchase price for the same product may vary, the app calculates the average purchase price for each product and updates it after every purchase operation.

In order to use the code, you need to set the following Environment Variables: DB_URL SECRET and change the username and password in both middleware.js and controller/login.js files.

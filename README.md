BreakOut-Mailer
=================
##### Mailing for the BreakOut Backend

Installation
------------

* register Sendgrid Event-Notifications to your /webhook url
* docker build -t breakout/mailer .
* docker run \
   -e MAILER_AUTH_TOKEN='shared-mailing-token' \  
   -e MAILER_SENDGRID_KEY='sg-key' \  
   -e MAILER_MONGO_USER='user' \  
   -e MAILER_MONGO_PASSWORD='password' \  
   -e MAILER_MONGO_DATABASE='mails' \  
   -e MAILER_MONGO_HOST='127.0.0.1:27017' \  
   -e MAILER_PORT=3003 \  
   -p 3003:3003 breakout/mailer

Usage
-----

**All Request must provide an AUTH-TOKEN**

`X-AUTH-TOKEN` Auth Token for Accessing API-Functions

**SendGrid Webhook**
----
  Events Notification Webhook to be called by Sendgrid
  
* **URL**

  /webhook

* **Method:**

  `POST`


**Send Mail**
----
  Sends a Mail to all Receivers in TO-Field

* **URL**

  /send

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   `tos = [String]` TO Receivers
   `subject = String` Subject of mail
   `html = String` Body as HTML
   
   **Optional:**
    
   `files = [String]` Urls of files as attachment
   `bccs = [String]` BCC Receivers
   `campaign_code = String` Code for Campaign




**Get Mail By ID**
----
  Get a mail with specific ID

* **URL**

  /get/:id

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `id = String` ID of mail to get



**Get Mails By Campaign**
----
  Get all mails for campaign code

* **URL**

  /get/campaign/:code

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `code = String` Campaign Code of mails to get



**Get all Mails**
----
  Get all mails

* **URL**

  /get

* **Method:**

  `GET`


**Get Mails with Error**
----
  Get all mails with Error

* **URL**

  /get/error

* **Method:**

  `GET`



**Get Mails from Date to Date**
----
  Get all Mails from Date to Date

* **URL**

  /get/:from/:to

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `from = Int` Unixtimestamp from when to get mails
   `to = Int` Unixtimestamp to when to get mails



**Get Mails to Receiver**
----
  Get all mails to specific receiver

* **URL**

  /get/to/:email

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `email = String` Email of receiver to get mails for

License
-----

breakout-mailer: Provides Mailing-functionality for the BreakoutBackend
Copyright (C) 2015 Philipp Piwowarsky

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
BreakOut-Mailer
=================
##### Mailing for the BreakOut Backend

Installation
-----
* set SENDGRID_KEY Env-Variable
* register Sendgrid Event-Notifications to your /webhook url
* npm install
* npm start

Usage
-----




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
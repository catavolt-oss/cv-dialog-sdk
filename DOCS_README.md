# Getting Started

This SDK provides easier access to the [Dialog REST API (OpenApi)](https://dialog.hxgn-api.net/v0/openapi.yaml)
which can be viewed with an [OpenApi Viewer/Editor](http://editor.swagger.io)

___
Contents:

- [Overview](#overview)

- [Usage](#usage)

- [First Steps](#first-steps)

- [Workbenches & Workbench Actions](#workbenches-and-workbench-actions)

- [Dialog Types](#types-of-dialogs)

- [Views and Records](#views-and-records)

- [Dialog Hierarchies](#dialog-hierarchies)

- [Menus and Actions](#menus-and-actions)

- [Offline](#offline)
___

## Installation

Install `cv-dialog-sdk` using npm:
```bash
npm install --save cv-dialog-sdk
```
the package will install in the `package.json` under dependencies

## Overview
![Overview](./../SDK_Overview.png)

### The Catavolt Dialog Model
The Catavolt Dialog Model represents an '***Abstract User Interface***', managed by the server, transposed via the Dialog Service, and delivered to the `cv-dialog-sdk`. This SDK contains the instruction set for rendering the client's UI.  This system differs subtly, but
significantly from traditional client/server architectures in that rather than targeting a specific resource (i.e.
next page), the client simply asks the server to redirect it to the 'next' resource (often without knowing
specifically what that resource will be).  

The **Dialog** abstraction itself, is a metaphor for a current channel of communication or more simply, a current
resource.  A **Dialog** contains information describing the UI itself, as well as any 'business data' that should be
displayed.  A **Redirection** is a pointer to the next **Dialog**.  An **Action** is a submission or instruction to the
server (to do 'something').  
A typical **Dialog** application flow is comprised of:  


1) Asking the server for a **Redirection** to a **Dialog** (e.g. rendered as an Html Page)

2) Performing an **Action** on the **Dialog** (e.g. user clicks a link)

3) Receiving a **Redirection** to the next **Dialog** (e.g. resulting Page is shown)


## Usage
To use the SDK, first include the objects you wish to pull into your project (this example pulls in the main Catavolt object and the Log. see the API for all components).
```Javascript
import { Catavolt, Log } from 'cv-dialog-sdk'; // pulls Catavolt and Log components
```
### First Steps
The first server-client interaction with a Xalt app is **setting the tenant Id** and **Logging a user in** using the `cv-dialog-sdk`.

The following occurs after the a tenantID is entered.
<!-- *The user enters a tenantID* -->
#### Pre-Login call for tenant informationCall
Prior to log in, The client needs to give and receive some information to the server. First, The client needs to make a call to receive the current tenant settings and capabilities when the tenant is set. This call returns a dictionary with information such as the languages the tenant has available for translation and the tenants ability to use the OAuth protocol.

- call `Catavolt.getCapabilities:tenantID:apiKey` *receive a `WSTenantCapabilityResult`*
```javascript
//insert sdk call once made
//this brings in a WSTenantCapabilityResult containing the tenant pre-login info
```

In addition, after gathering the tenant settings, the client must set the following device information:

Property Key | Type | Description
--- | --- | ---
ClientVersion | *String* | The version of the client (iOS, Android)
DisplayHeight | *Integer* | The height of the client screen/window
DisplayWidth | *Integer* | The width of the client screen/window
FormFactor | *String* | the form factor of the device size. Values: `small` is for phones. `medium` or `large` is for tablets.
GPSSupported | *Boolean* | If the client supports GPS. Values: `true`, `false`
platform | *String* | The client and device platform. *ex `android-react` or `ios-react`*

- Set device properties

    * dynamic value *(value is a function)*

        ```javascript
    Catavolt.addDynamicDeviceProp(key, value);
        ```

    * static value *(value is a static, non-function type)*
        ```javascript
    Catavolt.addStaticDeviceProp(key, value);
        ```

#### Login
There are two ways to log into the Xalt Framework, Basic Authentication and OAuth. If you have OAuth present in your system and need assistance integrating it to Catavolt Extender take a look at the [Catavolt User Guide](https://support.catavolt.com/customer/login?return_to=%2Fcustomer%2Fen%2Fportal%2Farticles%2F1342497-extender-v3-user-guide---october-15-2018).

On success, [Login](./interfaces/_models_login_.login.html) should create and pass back a [Session](./interfaces/_models_session_.session.html) (In the case of multi-factor authentication, it will present the proper authentication window [DialogRedirection](/interfaces/_models_dialogredirection_.dialogredirection.html) until it reaches the Session)

* Basic Authentication
    ```javascript
// Returns a promise
Catavolt.login(
    tenantID,
    clientType,
    userID,
    password,
).then(session => {
    //Do any post login calls here
});
    ```
* oAuth

    oAuth requires native platform rendering and display of the browser window for loading the oAuthUrl that is set in Xalt Extender *(see the Catavolt User Guide linked above)*. Along with the oAuthUrl, you will also need to generate a proof key. The proofKey will be passed along with the oAuth call in order to prevent man in the middle attacks on the login token issuance. (a strong crypto string with at least 16 characters is recommended)

    Use the following to get the oAuthUrl
    ```javascript
    const proofKey = await // acquire a random crypto security string method
    const initUrl = await CatavoltAuth.getOAuthUrl(tenantID, proofKey); // insert the tenantID and the generated proofKey
    ```
    At this point, you will need to display the URL and create an event listener to extract the callbackURL


```javascript
//returns a Promise
Catavolt.loginWithToken(
    tenantID,
    clientType,
    permissionToken,
    proofKey,
).then(session => {
    //Do any post login calls here
});
Catavolt.onSessionExpiration = pageController.logout;
```
### Workbenches and Workbench Actions
A Dialog flow is initiated by performing a **WorkbenchAction**.  A given user may have one or more **Workbench**es
which may have one or more **WorkbenchAction**s.  These provide entry points into the various application flows and can
be thought of as initial 'Menus' with 'Menu Items'.  Performing a **WorkbenchAction** will begin the **Dialog**
application flow as described above.

### Types of Dialogs
**Dialog**s will always be one of two subtypes:  
1) An **EditorDialog**  
This type of **Dialog** is associated with one, single 'data record'   
E.g.  Viewing the 'Details' of a single list item  
2) A **QueryDialog** is associated with a list of 'data records'  
E.g.  Viewing a tabular list or a map with location points  

### Views and Records
A **Dialog** is always associated with a **View** and one or more **Records**.  **View**s represent various ways
of displaying the 'data record(s)' to the user.  **View**s themselves DO NOT contain the 'data record(s)',
only information about how it
should be displayed.  
Some types of Views are:
1) **Details** (Properties)
2) **List**
3) **Form** (Layout other Views)
4) **Map**
5) **Graph** (or chart)  

**Record**s contain the actual business data for display and may be combined with the display metadata provided by
the **View**, to render the UI.  
* A single **Record** may be retrieved directly from an **EditorDialog**, following a **read()** operation.  
* Multiple **Records** may be retrieved as a **RecordSet** from a **QueryDialog** via the query() method.
However, a **QueryScroller** may also be obtained from the **QueryDialog**, and provides a buffer with record
pagining functionality.

### Dialog Hierarchies
**Dialog**s may be composed of one or more 'child' **Dialog**s. This is typically used to layout a
'Form', such that the top-level is **Dialog** is an **EditorDialog** with a **Form** **View** .  The **EditorDialog**
will also have a list of 'child' **Dialog**s which will contain the **View**s to be arranged based on the **Form**
**View**'s metadata.
* When retrieving a new **Dialog** (i.e. following a **DialogRedirection**), the top-level **Dialog** will be an
**EditorDialog** with a **Form** **View**
* This **Dialog**'s 'child' **Dialogs** will typically be used to compose the UI (**Lists**, Details, Maps, etc.)


### Menus and Actions
**View**s are associated with a **Menu**, which may in turn have a list of 'child' **Menu**s, enabling a hierarchical
representation of nested menus and menu items.  A **Menu** may also have an '**actionId**' which can be used to
'perform an Action' on the associated **Dialog**, typically resulting in the server returning a **Redirection** to
another **Dialog** (i.e. resource, page, etc.)
* **Actions** are used to transition from one **Dialog** to the next.
* **actionId**s are simply strings but are typically retrieved from **Menu**s associated with a **View*````````*

### Documentation And Tools
* **Dialog model** can be found [here](https://rawgit.com/catavolt-oss/cv-dialog-sdk/master/docs/dialog_model.pdf)
* **(early) Api Docs** can be found [here](https://rawgit.com/catavolt-oss/cv-dialog-sdk/master/docs/cv-dialog-sdk/index.html)

### Offline
Documentation coming soon

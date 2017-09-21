# forge-webcomponents
A set of web components ready to use inside the Forge Backoffice NFL environment

Install via npm http-server and use:

    http-server . -e "json" --cors



#Test Runner

Install Java
     https://java.com/download/

Install bower
    npm install -g bower

Install web-component-tester (in the project folder)
    npm install -g bower
    bower install Polymer/web-component-tester --save
    bower install --save-dev web-component-tester
    
Run Test 
    wct --configFile fst.wct.config.json -p

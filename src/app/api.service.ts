import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiURL: string = 'http://camunda.northcentralus.azurecontainer.io:8080/engine-rest';

  createTaskData = {  
    "variables":{  
       "age":{  
          "value": 24,
           "type": "integer"
       },
        "history":{  
          "value": false,
           "type": "boolean"
       },
       "reports":{  
          "value":false,
          "type":"boolean"
       },
        "skill":{  
          "value":"New To Market",
          "type":"string"
       },
         "qset_status":{  
          "value":"Incomplete",
          "type":"string"
       },
        "status":{  
          "value":"inprogress",
          "type":"string"
       }
       ,
       "data_verified":{  
         "value":false,
         "type":"boolean"
      }
       
    }
 };

 completeTaskData = {  
  "variables":{  
    "data_verified":{  
      "value":false,
      "type":"boolean"
   },
     "usertaskResult":{  
        "value":{  
           "action": "",
           "user": "",
              "data": {"letter": true, "fax": true, "call": false}
        }
     }
  }
}
  constructor(private httpClient: HttpClient) {}

  public initiateWF(data: any){
    return this.httpClient.post(`${this.apiURL}/process-definition/key/Aetna/start/`,data);
}

public completeTask(taskid: string, data:any){
  return this.httpClient.post(this.apiURL + '/task/' + taskid + '/complete', data);
}workflow: any

public getTasks(){
  return this.httpClient.get(`${this.apiURL}/task?processDefinitionKey=Aetna`);
}

public getaTasks(){
  return this.httpClient.get(`http://camunda.northcentralus.azurecontainer.io:8080/engine-rest/task?processDefinitionKey=invoice`);
}

}


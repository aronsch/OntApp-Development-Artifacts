# OntApp/Reqs Development Environment

OntApp is a set of linked [containers](http://en.wikipedia.org/wiki/LXC) deployed using [Docker](https://www.docker.com).

See the client [data model reference](#data-model-reference) below for information on the JSON structures accepted by the OntApp client application.

## Deploying and Starting the Development Environment

- **On MacOS**, use the [Docker](https://download.docker.com/mac/stable/Docker.dmg) application to run Docker.

1. From the directory you want the repository placed in, enter `git clone https://github.com/aronsch/OntAppVMCluster.git`
2. Run `start.sh` in the repository's root directory.

A detailed description of the startup process is [below](#building-and-running-the-development-environment).

### Reaching the Development Environment
- Running containers can be reached at `localhost`.

## Use Developement Branches

The `development` branch is the main development branch. The `master` branch is our current stable branch - don't commit directly to master.

### Setting up Your Local Repository
Use `git config --global push.default current` to tell git to push your current, checked-out branch whenever you use `git push`.

### Working, Committing and Pushing Your Changes
**Don't** commit directly to the `master` branch. 

When working on features or fixes:
 1. Use `git checkout -b your-branch-name` to create a new local branch and switch to it.
 2. Make commits to this new branch while working.
 3. When the work is completed, switch to the `development` branch.
 4. Use `git merge your-branch-name` to merge your commits into the development branch
 5. Use `git push` to push the branch to GitHub.

Initiate a [pull request](https://help.github.com/articles/using-pull-requests/) to have the changes reviewed and then merged into the stable `master` branch.

### Resolving Push Conflicts

If your local repository is behind the remote repository, your push will be rejected.

#### Options
- If all of current changes have been committed, use `git pull` to pull and merge changes from the remote repository.
- If you have uncommitted changes:
  1. Use `git stash` to stash your current changes and bring local state back to the last commit.
  2. Use `git pull` to pull the latest commits.
  3. Use `git stash pop` to restore your changes on top of the updated state.

### Useful Git Commands
Other commands:
 * `git branch` to list current branches
 * `git checkout [branch-name]` to switch branches
 * `git branch -d [branch-name]` to delete a branch

See the [GitHub Collaborating guide](https://help.github.com/categories/collaborating/) for more information about forking and pull requests.

### Git GUI Application
Try [Tower](https://www.git-tower.com) if you want a Git GUI application.

## Distribution of Services
Services are distributed in 4 separate Docker containers:
* Parliament Server
* OntApp Tomcat Server
* [MEAN.js](http://meanjs.org) Client-Facing Server
* MongoDB Server for Client-Facing Server

The client-facing server is an [Express.js](http://expressjs.com) application built using [MEAN.js](http://meanjs.org).

## Accessing Parliament From Tomcat Server

Parliament is linked directly to the Tomcat server. From within the OntApp container, Parliament can be reached at `http://parliament:8080/parliament/`.


## Building and Running the Development Environment

### Building and Starting the Service Containers

Run `./start.sh` to start the services. This will build the service container images. The first time this is run it will take several minutes as Docker downloads all image dependencies. Subsequent builds will use cached images and will only take a few seconds.

The services build process, as specified in [`build.sh`](scripts/build.sh):

1. Parliament VM
  * Parliament is [downloaded](parliament.zip http://semwebcentral.org/frs/download.php/522/ParliamentQuickStart-v2.7.6-gcc-64.zip) and unzipped into the container's `usr/local` directory.

2. OntApp TomCat Application
  * The TomCat image launches and copies the provided OntServer/OntApp.war file into its webapp directory.

3. MongoDB
  * The MongoDB server launches. This database stores all persistent user information, including permissions, from the client-facing web server.

4. MEAN.js Client-Facing Server
  * The client-facing server container launches last once all other container are available.

The services launch process, as specified beginning [`start.sh#L34`](start.sh#L34):

1. Containers are started in this order:
  1. Parliament
  2. OntApp (dependency: Parliament)
  3. MongoDB
  4. MEAN.js (dependencies: MongoDB, OntApp)
  
2. Base ontologies stored in `OntApp.war` are extracted and loaded into Parliament as specified in [`load_ontologies.sh`](scripts/load_ontologies.sh).

3. When finished, the launch process will run `docker ps` to list all running containers so that you can visually confirm that all services are running.

### Stopping the Containers
Run `stop.sh` to stop all service containers.

### Updating `OntApp.war` During Development
Files titled `OntApp.war` can be deployed to `OntApp/warfiles/`. The OntApp container with automatically stop the current version of OntApp and replace it with the version placed in the folder.

## Utilities

### Reset Docker Images
It may necessary to reset Docker images if something in the build process stops working.
* Run `/scripts/destroy.sh` to completely remove all downloaded or built Docker images. 

#OntApp Data Model Reference
This is a reference of all JSON data structures that the Node client-facing web server accepts. Structures that have not yet been implemented are noted.

## Requirement Client/UI Model Object
A model used to represent a Requirement for the client/UI. See the [extensions](#contextual-requirement-model-extensions) list for contextual extensions to this client/UImodel.

#### JSON Structure
* `Class` 
* `Label`
* `IRI`
* `Organization URL`
* `Properties`
  * `Property` 
    * `Label`
    * `IRI`
    * [`Format`](#requirement-properties-format-tags)
    * `Value`
    * `Enum` [ Array ] **optional** enumeration of valid `Value`s.

#### JSON Example
```
{
    "Class": "Requirement",
    "Label": "Requirement",
    "IRI": "<>",
    "OrganizationURL": ""
    "Properties": {
        "Priority": {
            "Label": "Priority",
            "IRI": "<>",
            "Format": "selection[1,1]",
            "Value": "",
            "Enum": [
                {
                    "Label": "Mandatory Priority",
                    "IRI": "<>"
                },
                {
                    "Label": "High Priority",
                    "IRI": "<>"
                },
                {
                    "Label": "Medium Priority",
                    "IRI": "<>"
                },
                {
                    "Label": "Low Priority",
                    "IRI": "<>"
                },
                {
                    "Label": "No Priority",
                    "IRI": "<>"
                }
            ]
        },
        "Description": {
                "Label": "Description",
                "Format": "string large",
                "Value": ""
         }
        "Created": {
                "Label": "Created",
                "Format": "date readonly hidden",
                "Value": ""
         }
    }
}
```

### Requirement Client/UI Model Object - Property - Property Description
Description or explanation of a `Requirement` `Property`.
#### JSON Structure
- `Requirement`
 - `Properties`
    - `Property`
      - `PropertyDescription` String

#### JSON Example
```
"Description" {
	"PropertyDescription": "Description of what property represents."
}
```

### Requirement Client/UI Model Object - `Description` Property - Term Annotation Object

Term object for annotating text with links to other requirements with the same term. The is a sub-property of the Requirement `Description` property.
#### JSON Structure
- `Requirement`
 - `Properties`
    - `Property`
      - `TermAnnotation`[ ] Array of Term Annotation Objects
        - `Term` Term string to be matched in description
        - `AlsoContainsTerm` [ Array ] of references to Requirements that also contain `Term`
        - `TotalCount` Total number of requirements that also contain term. Can be higher than number of AlsoContainsTerm result count.

#### JSON Example
```
"Description" {
	"TermAnnotation":
        {
            "Term" : "system", 
            "AlsoContainsTerm": [
                { "Name" : "Requirement" }
                { "IRI" : ""
            ],
            "TotalCount" : 1
        }
    ]
}
```

### Related Requirements Object
A 'Related Requirements' object is used for attaching references to related requirements and the type (or quality) of that relationship. This is included as a property of `Requirement`.

#### JSON Structure
- `Requirement`
 - `Properties`
    - `RelatedRequirements`
       - `IRI`
       - `Value` [ ] Array of Related Requirement references
         - `Name`
         - `Relation` Indicates type (or quality) of relationship
         - `Subtype` Relationship quality subtype (current subtypes: who, what, when where)
         - `IRI`


#### JSON Example
```
"RelatedRequirements": {
   "Properties": {
       "RelatedRequirements": {
           "Value": [
               {
                   "Name": "Requirement Author",
                   "Relation": "SubRequirement",
                   "Subtype": "What",
                   "IRI": ""
               }
           ]
       }
   }
}
```
---
## Requirement Properties Format Tags
Format tags can be included in a Requirement property under the `Format` key. Format tags instruct the client app how to present a Property to the user.

Format|Description
:---|:---
string|
string large|Large strings will be assumed to be multiline text. They will be placed in text blocks and edited via text area form elements in the user interface.
number|
range[*min,max*]|
date| Date information.
datetime| Date and time information.
boolean|
readonly|Indicates read-only status.  Example: `Format : "string readonly"`
required|Indicate that a value is required for a form to be valid.
hidden|Indicate that the field should be hidden from the user.
string[*max length*]|For string formats, optionally specify a maximum length. 

### Enumeration Format
Enumerated properties can provide a *selection* format that will be used to control selection behavior when presented as a form field. A single-select drop-down field will be used by default if a *selection* format isn't provided.

---

## Contextual `Requirement` Client/UI Model Extensions
Extensions to the Requirement model object that can be included in specific contexts.

### Search
* `Properties`
  * `GeneralSearchTerm` General Search Term String

## Comment Object
[See the wiki](https://github.com/aronsch/OntAppVMCluster/wiki/Comments) for further details and implementation notes.

### Object Structure

Object Key|Description
:--|:--
`IRI`|IRI of `Comment` instance
`CreatedDateTime`|Date the `Comment` was created
`RelatedToIRI`|IRI of `Requirement` the comment was posted on
`UpdatedDateTime`|
`UserName`|Display name of user who posted comment
`UserIRI`|IRI of user who posted comment
`Value`|Text of comment

### JSON Example
```
{
    "IRI": "http://www.engineeringsemantics.com/data/requirements/WebBasedTool_Comment20160123T153800372",
    "CreatedDateTime": "2016-01-23T15:38:00.368-05:00",
    "RelatedToIRI": "http://www.engineeringsemantics.com/data/requirements/WebBasedTool",
    "UserName": "Someone",
    "UserIRI": "http://www.engineeringsemantics.com/data/users/someone",
    "Value": "<p>This requirement needs much more detail/explanation (i.e., additional sub-requirements).</p>"
}
```



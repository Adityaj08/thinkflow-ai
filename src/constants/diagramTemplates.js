// Default diagram templates for each diagram type
// These are shown when user selects a diagram type (preview before generating)

export const DIAGRAM_TEMPLATES = {
    flowchart: `graph TD
    A[Start] --> B{Decision?}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`,

    sequence: `sequenceDiagram
    participant User
    participant Server
    participant Database
    User->>Server: Request
    Server->>Database: Query
    Database-->>Server: Result
    Server-->>User: Response`,

    class: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +fetch()
    }
    class Cat {
        +scratch()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,

    state: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : Start
    Processing --> Success : Complete
    Processing --> Error : Fail
    Success --> [*]
    Error --> Idle : Retry`,

    er: `erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ITEM : contains
    USER {
        int id
        string name
        string email
    }
    ORDER {
        int id
        date created
    }`,

    journey: `journey
    title User Shopping Journey
    section Browse
      Visit site: 5: User
      Search products: 4: User
    section Purchase
      Add to cart: 5: User
      Checkout: 3: User
      Payment: 4: User`,

    gantt: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Planning
        Research: 2024-01-01, 7d
        Design: 2024-01-08, 5d
    section Development
        Frontend: 2024-01-15, 14d
        Backend: 2024-01-15, 14d
    section Launch
        Testing: 2024-01-29, 7d
        Deploy: 2024-02-05, 3d`,

    pie: `pie title Technology Stack
    "React" : 40
    "Node.js" : 25
    "Python" : 20
    "Other" : 15`,

    quadrant: `quadrantChart
    title Features Priority
    x-axis Low Effort --> High Effort
    y-axis Low Impact --> High Impact
    quadrant-1 Quick Wins
    quadrant-2 Major Projects
    quadrant-3 Fill-ins
    quadrant-4 Thankless Tasks
    Feature A: [0.3, 0.8]
    Feature B: [0.7, 0.9]
    Feature C: [0.2, 0.3]
    Feature D: [0.8, 0.2]`,

    requirement: `requirementDiagram
    requirement UserAuth {
        id: 1
        text: Users must authenticate
        risk: high
        verifymethod: test
    }
    element LoginPage {
        type: module
    }
    LoginPage - satisfies -> UserAuth`,

    gitgraph: `gitGraph
    commit id: "Initial"
    branch develop
    checkout develop
    commit id: "Feature A"
    commit id: "Feature B"
    checkout main
    merge develop
    commit id: "Release"`,

    c4: `C4Context
    title System Context
    Person(user, "User", "End user")
    System(app, "Application", "Main app")
    System_Ext(api, "External API", "Third party")
    Rel(user, app, "Uses")
    Rel(app, api, "Calls")`,

    mindmap: `mindmap
    root((ThinkFlow))
        Features
            AI Generation
            Multiple Models
            Export Options
        Diagrams
            Flowchart
            Sequence
            Class
        UI
            Dark Mode
            Responsive`,

    timeline: `timeline
    title Product Roadmap
    section Q1
        Jan : Research : Planning
        Feb : Design : Prototyping
        Mar : Development
    section Q2
        Apr : Testing
        May : Beta Launch
        Jun : Public Release`,

    zenuml: `zenuml
    title Order Process
    Client->Server.process() {
        Server->DB.save()
        DB-->Server: saved
    }
    Server-->Client: done`,

    sankey: `sankey-beta
    Source,Target,Value
    Energy,Heat,30
    Energy,Light,20
    Energy,Motion,50
    Heat,Loss,10
    Heat,Use,20`,

    xychart: `xychart-beta
    title "Sales Data"
    x-axis [Jan, Feb, Mar, Apr, May]
    y-axis "Revenue" 0 --> 100
    bar [30, 45, 60, 75, 90]
    line [25, 40, 55, 70, 85]`,

    block: `block-beta
    columns 3
    A["Input"] B["Process"] C["Output"]
    A --> B --> C`,

    packet: `packet-beta
    title Network Packet
    0-15: "Source Port"
    16-31: "Destination Port"
    32-63: "Sequence Number"
    64-95: "Acknowledgment"`,

    kanban: `kanban
    Todo
        Task 1
        Task 2
    In Progress
        Task 3
    Done
        Task 4
        Task 5`,

    architecture: `architecture-beta
    group cloud(cloud)[Cloud]
    service server(server)[Server] in cloud
    service db(database)[Database] in cloud
    service client(internet)[Client]
    client:R --> L:server
    server:B --> T:db`,

    radar: `%%{init: {"radar": {"axisLabelFontSize": 14}}}%%
    radar-beta
    title Skills Assessment
    axis Programming, Design, DevOps, Testing, Communication
    curve a: 80, 60, 70, 85, 75
    curve b: 70, 80, 60, 65, 90`,

    treemap: `treemap-beta
    title Storage Usage
    Files
        Documents: 30
        Images: 25
        Videos: 45`
};

// Get template for a specific diagram type
export const getTemplateForType = (type) => {
    return DIAGRAM_TEMPLATES[type] || DIAGRAM_TEMPLATES.flowchart;
};

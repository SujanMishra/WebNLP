 class DetectLanguage {
    constructor() {
        this.languages = {

            'javascript': [
                // Basic syntax
                {pattern: /undefined/, points: 2, comment: "Undefined keyword"},
                {pattern: /console\.log\(/, points: 2, comment: "Console log statements"},
                {pattern: /(var|const|let)\s+\w+/, points: 2, comment: "Variable declaration (var, const, let)"},
                {pattern: /function\s+\w+\(/, points: 2, comment: "Function declaration"},
                {pattern: /\(.*\)\s*=>/, points: 2, comment: "Arrow function"},

                // Control structures
                {pattern: /if\s*\(.+\)/, points: 2, comment: "If statement"},
                {pattern: /else\s*if\s*\(.+\)/, points: 2, comment: "Else if statement"},
                {pattern: /else/, points: 2, comment: "Else statement"},
                {pattern: /switch\s*\(.+\)/, points: 2, comment: "Switch statement"},
                {pattern: /case\s+.+:/, points: 2, comment: "Case in switch"},
                {pattern: /while\s*\(.+\)/, points: 2, comment: "While loop"},
                {pattern: /for\s*\(.+\)/, points: 2, comment: "For loop"},
                {pattern: /do\s*{/, points: 2, comment: "Do while loop"},
                {pattern: /try\s*{/, points: 2, comment: "Try block"},
                {pattern: /catch\s*\(.*\)/, points: 2, comment: "Catch block"},

                // Objects and Arrays
                {pattern: /\w+\s*:\s*\w+/, points: 2, comment: "Object property"},
                {pattern: /{\s*\w+/, points: 2, comment: "Object literal"},
                {pattern: /\[\s*.*\s*]/, points: 2, comment: "Array literal"},

                // ES6 and beyond
                {pattern: /class\s+\w+/, points: 2, comment: "Class declaration"},
                {pattern: /import\s+\w+\s+from/, points: 2, comment: "Import statement"},
                {pattern: /export\s+default/, points: 2, comment: "Export default"},
                {pattern: /async\s+function/, points: 2, comment: "Async function"},
                {pattern: /await\s+\w+/, points: 2, comment: "Await keyword"},

                // DOM and Browser APIs
                {pattern: /document\.getElementById\(/, points: 2, comment: "DOM getElementById"},
                {pattern: /document\.querySelector\(/, points: 2, comment: "DOM querySelector"},
                {pattern: /window\.\w+/, points: 2, comment: "Window object usage"},

                // Functions and Methods
                {pattern: /\bfunction\b\s+[a-zA-Z_$][0-9a-zA-Z_$]*\s*\(.*\)\s*{/, points: 2, comment: "Named function"},
                {pattern: /=>\s*{/, points: 2, comment: "Arrow function with block"},
                {pattern: /function\*/, points: 2, comment: "Generator function"},
                {pattern: /return\s+[a-zA-Z_$][0-9a-zA-Z_$]*;/, points: 2, comment: "Return statement"},

                // Classes and Constructors
                {pattern: /constructor\s*\(.*\)\s*{/, points: 2, comment: "Class constructor"},
                {pattern: /extends\s+[a-zA-Z_$][0-9a-zA-Z_$]*/, points: 2, comment: "Class inheritance"},
                {pattern: /super\(.*\)/, points: 2, comment: "Super call"},
                {pattern: /static\s+[a-zA-Z_$][0-9a-zA-Z_$]*\s*=/, points: 2, comment: "Static method or property"},

                // Promises and Async
                {pattern: /\.then\(/, points: 2, comment: "Promise then"},
                {pattern: /\.catch\(/, points: 2, comment: "Promise catch"},
                {pattern: /\.finally\(/, points: 2, comment: "Promise finally"},
                {pattern: /async\s+/, points: 2, comment: "Async keyword"},
                {pattern: /await\s+/, points: 2, comment: "Await keyword"},

                // Common JavaScript Objects and APIs
                {pattern: /Math\.\w+/, points: 2, comment: "Math object"},
                {pattern: /JSON\.(parse|stringify)\(/, points: 2, comment: "JSON object"},
                {pattern: /Date\(\)/, points: 2, comment: "Date object"},
                {pattern: /localStorage\./, points: 2, comment: "LocalStorage API"},
                {pattern: /sessionStorage\./, points: 2, comment: "SessionStorage API"},
                {pattern: /navigator\./, points: 2, comment: "Navigator API"},
                {pattern: /console\./, points: 2, comment: "Console API"},

                // Event Handling
                {pattern: /\.addEventListener\(/, points: 2, comment: "Add event listener"},
                {pattern: /\.removeEventListener\(/, points: 2, comment: "Remove event listener"},
                {pattern: /event\.\w+/, points: 2, comment: "Event object properties"},

                // Common Libraries and Frameworks
                {pattern: /\$\(.*\)/, points: 2, comment: "jQuery usage"},
                {pattern: /React\./, points: 2, comment: "React usage"},
                {pattern: /angular\./, points: 2, comment: "Angular usage"},
                {pattern: /Vue\./, points: 2, comment: "Vue.js usage"},

                // Negative patterns
                {pattern: /<script/, points: -50, comment: "HTML script tag"},
                {pattern: /<\/script>/, points: -50, comment: "HTML closing script tag"}
            ],


            'c': [
                // Basic Syntax and Types
                {pattern: /(char|long|int|float|double)\s+\w+\s*=?/, points: 2, comment: "Basic variable declaration"},
                {pattern: /struct\s+\w+\s*{/, points: 2, comment: "Struct declaration"},
                {pattern: /enum\s+\w+\s*{/, points: 2, comment: "Enum declaration"},
                {pattern: /union\s+\w+\s*{/, points: 2, comment: "Union declaration"},
                {pattern: /typedef\s+\w+\s+\w+;/, points: 2, comment: "Typedef"},
                {pattern: /volatile\s+\w+/, points: 2, comment: "Volatile keyword"},
                {pattern: /static\s+\w+/, points: 2, comment: "Static keyword"},

                // Memory Management
                {pattern: /malloc\(.+\)/, points: 2, comment: "Memory allocation"},
                {pattern: /free\(.+\)/, points: 2, comment: "Memory deallocation"},
                {pattern: /sizeof\(.+\)/, points: 2, comment: "Sizeof operator"},

                // Control Structures
                {pattern: /(else )?if\s*\(.+\)/, points: 1, comment: "Conditional statement"},
                {pattern: /while\s*\(.+\)/, points: 1, comment: "While loop"},
                {pattern: /for\s*\(.+\)/, points: 2, comment: "For loop"},
                {pattern: /switch\s*\(.+\)/, points: 2, comment: "Switch statement"},
                {pattern: /case\s+.+:/, points: 2, comment: "Case in switch"},
                {pattern: /break;/, points: 1, comment: "Break statement"},
                {pattern: /continue;/, points: 1, comment: "Continue statement"},

                // Function and Pointer Usage
                {pattern: /\w+\s*\*\s*\w+/, points: 2, comment: "Pointer declaration"},
                {pattern: /\w+\s*\*\*\s*\w+/, points: 2, comment: "Pointer to pointer declaration"},
                {pattern: /->/, points: 2, comment: "Arrow operator for pointers"},
                {pattern: /scanf\(.+\)/, points: 2, comment: "Scanf function"},
                {pattern: /printf\(.+\)/, points: 2, comment: "Printf function"},
                {pattern: /return\s+.*/, points: 2, comment: "Return statement"},
                {pattern: /void\s+\w+\(.*\)/, points: 2, comment: "Void function declaration"},

                // Preprocessor Directives
                {pattern: /#include\s+[<"]\w+\.h[>"]/, points: 2, comment: "Include directive"},
                {pattern: /#define\s+.+/, points: 1, comment: "Macro definition"},
                {pattern: /#pragma\s+\w+/, points: 2, comment: "Pragma directive"},
                {pattern: /#ifndef\s+\w+/, points: 2, comment: "If not defined directive"},
                {pattern: /#ifdef\s+\w+/, points: 2, comment: "If defined directive"},
                {pattern: /#endif/, points: 1, comment: "End if directive"},

                // Arrays and Strings
                {pattern: /\w+\s+\w+\[.+]/, points: 1, comment: "Array declaration"},
                {pattern: /".+"/, points: 2, comment: "String literal"},

                // Negative Patterns
                {pattern: /new\s+\w+/, points: -1, comment: "C++ style new (negative)"},
                {pattern: /var\s+\w+\s*=?/, points: -1, comment: "JavaScript style variable declaration (negative)"},
                {pattern: /'.{2,}'/, points: -1, comment: "Multi-character constant (negative)"},

                // Misc
                {pattern: /NULL/, points: 1, comment: "NULL constant"},
                {pattern: /void/, points: 1, comment: "Void keyword"},
                {pattern: /#error\s+.*/, points: 2, comment: "Error directive in preprocessor"},
                {pattern: /goto\s+\w+;/, points: 2, comment: "Goto statement"},
                {pattern: /extern\s+\w+\s+\w+;/, points: 2, comment: "Extern variable declaration"},
                {pattern: /const\s+\w+\s+\w+;/, points: 2, comment: "Const variable declaration"},
                {pattern: /inline\s+\w+\s+\w+\(.*\)/, points: 2, comment: "Inline function declaration"},
                {pattern: /register\s+\w+\s+\w+;/, points: 2, comment: "Register variable"},

                // Function Pointers
                {pattern: /\w+\s*\(\*\s*\w+\)\(.*\)/, points: 2, comment: "Function pointer declaration"}
            ],

            'cpp': [
                // Basic Syntax and Types
                {
                    pattern: /(char|long|int|float|double|short|unsigned)\s+\w+\s*=?/,
                    points: 2,
                    comment: "Basic variable declaration"
                },
                {pattern: /std::\w+/, points: 2, comment: "Standard library usage"},
                {pattern: /auto\s+\w+\s*=/, points: 2, comment: "Auto keyword for type inference"},
                {pattern: /void/, points: 1, comment: "Void keyword"},

                // Class and Object-Oriented Programming
                {pattern: /class\s+\w+/, points: 1, comment: "Class declaration"},
                {pattern: /public:|protected:|private:/, points: 2, comment: "Access specifiers"},
                {pattern: /virtual\s+\w+/, points: 2, comment: "Virtual function"},
                {pattern: /override/, points: 2, comment: "Override specifier"},
                {pattern: /friend\s+\w+/, points: 2, comment: "Friend specifier"},
                {pattern: /explicit\s+operator\s+\w+/, points: 2, comment: "Explicit operator"},

                // Templates and Generics
                {pattern: /template\s*<.*>/, points: 2, comment: "Template declaration"},
                {pattern: /\w+<\w+>/, points: 1, comment: "Template usage"},

                // Memory Management
                {pattern: /new\s+\w+(\(.*\))?/, points: 1, comment: "New keyword for dynamic allocation"},
                {pattern: /delete\s+\w+/, points: 2, comment: "Delete keyword"},

                // Input and Output
                {pattern: /(cout|cin|endl)/, points: 2, comment: "I/O stream objects"},

                // Control Structures
                {pattern: /(else )?if\s*\(.+\)/, points: 1, comment: "Conditional statement"},
                {pattern: /while\s*\(.+\)/, points: 1, comment: "While loop"},
                {pattern: /for\s*\(.+\)/, points: 2, comment: "For loop"},

                // Preprocessor Directives
                {pattern: /#include\s*([<"])\w+(\.h)?([>"])/, points: 2, comment: "Include directive", nearTop: true},
                {pattern: /#define\s+.+/, points: 1, comment: "Macro definition"},
                {pattern: /#pragma\s+\w+/, points: 2, comment: "Pragma directive"},

                // Namespaces
                {pattern: /using\s+namespace\s+.+;/, points: 2, comment: "Using namespace"},

                // Casting and Type Conversions
                {pattern: /dynamic_cast<\w+>\(.+\)/, points: 2, comment: "Dynamic cast"},
                {pattern: /reinterpret_cast<\w+>\(.+\)/, points: 2, comment: "Reinterpret cast"},
                {pattern: /static_cast<\w+>\(.+\)/, points: 2, comment: "Static cast"},
                {pattern: /const_cast<\w+>\(.+\)/, points: 2, comment: "Const cast"},

                // Operators and Special Characters
                {pattern: /\w*::\w+/, points: 1, comment: "Scope resolution operator"},
                {pattern: /nullptr/, points: 2, comment: "Nullptr keyword"},

                // Negative Patterns
                {pattern: /'.{2,}'/, points: -1, comment: "Multi-character constant (negative)"},
                {
                    pattern: /(List<\w+>|ArrayList<\w*>( )*\(.*\))(( )+\w+|;)/,
                    points: -1,
                    comment: "Java style collections (negative)"
                },

                // Additional Patterns
                {pattern: /enum\s+class\s+\w+/, points: 2, comment: "Scoped enumeration (enum class)"},
                {pattern: /constexpr\s+\w+\s+\w+/, points: 2, comment: "Constexpr specifier"},
                {pattern: /noexcept/, points: 2, comment: "Noexcept specifier"},
                {pattern: /static_assert\(.*\)/, points: 2, comment: "Static assert"},
                {pattern: /alignof\(.*\)/, points: 2, comment: "Alignof operator"},
                {pattern: /decltype\(.*\)/, points: 2, comment: "Decltype specifier"},
                {pattern: /thread_local/, points: 2, comment: "Thread local storage"}
            ],


            'python': [
                // Function and Class Definitions
                {pattern: /def\s+\w+\(.*\):/, points: 2, comment: "Function definition"},
                {pattern: /class\s+\w+(\(\s*\w+\s*\))? *:/, points: 2, comment: "Class definition"},
                {pattern: /__init__/, points: 2, comment: "Constructor method"},
                {pattern: /@property/, points: 2, comment: "Property decorator"},
                {pattern: /lambda\s+.+:/, points: 2, comment: "Lambda function"},

                // Control Structures
                {pattern: /if\s+.+:/, points: 2, comment: "If statement"},
                {pattern: /elif\s+.+:/, points: 2, comment: "Elif statement"},
                {pattern: /else:/, points: 2, comment: "Else statement"},
                {pattern: /for\s+\w+\s+in\s+.+:/, points: 2, comment: "For loop"},
                {pattern: /while\s+.+:/, points: 2, comment: "While loop"},

                // Import Statements
                {pattern: /import\s+\w+/, points: 1, comment: "Import statement", nearTop: true},
                {pattern: /from\s+\w+\s+import\s+(\w+|\*)/, points: 2, comment: "Importing from modules"},
                {pattern: /import sys/, points: 2, comment: "Import sys module"},

                // Variable and Assignment
                {pattern: /\w+\s*=\s*\w+/, points: 1, comment: "Variable assignment"},
                {pattern: /global\s+\w+/, points: 2, comment: "Global keyword"},
                {pattern: /nonlocal\s+\w+/, points: 2, comment: "Nonlocal keyword"},
                {pattern: /self\./, points: 2, comment: "Self keyword for instance reference"},

                // Built-in Functions and Statements
                {pattern: /print\s*\(.+\)/, points: 1, comment: "Print function"},
                {pattern: /yield\s+.+/, points: 2, comment: "Yield keyword"},
                {pattern: /raise\s+\w+/, points: 2, comment: "Raise exception"},
                {pattern: /__name__\s*==\s*'__main__'/, points: 2, comment: "Main method check"},

                // Negative Patterns
                {pattern: /&&|\|\|/, points: -1, comment: "Logical operators (negative - not Pythonic)"},

                // Additional Patterns
                {pattern: /try:/, points: 2, comment: "Try block"},
                {pattern: /except\s+\w*:/, points: 2, comment: "Except block"},
                {pattern: /finally:/, points: 2, comment: "Finally block"},
                {pattern: /with\s+\w+\s+as\s+\w+:/, points: 2, comment: "With statement for context management"},
                {pattern: /assert\s+.+/, points: 2, comment: "Assert statement"},
                {pattern: /list\(|dict\(|set\(|tuple\(/, points: 2, comment: "Explicit type conversions"},
                {pattern: /@.+/, points: 2, comment: "Decorator usage"},
                {pattern: /async\s+def/, points: 2, comment: "Async function definition"},
                {pattern: /await\s+\w+/, points: 2, comment: "Await keyword"},
                {pattern: /@staticmethod/, points: 2, comment: "Static method decorator"},
                {pattern: /@classmethod/, points: 2, comment: "Class method decorator"}
            ],


            'java': [
                // Class and Interface Declarations
                {pattern: /public\s+class\s+\w+/, points: 2, comment: "Class declaration"},
                {pattern: /extends\s+\w+/, points: 2, comment: "Extends class"},
                {pattern: /implements\s+\w+/, points: 2, comment: "Implements interface"},
                {pattern: /public\s+interface\s+\w+/, points: 2, comment: "Interface declaration"},

                // Variables and Types
                {pattern: /String\s+\w+\s*=?/, points: 2, comment: "String variable declaration"},
                {pattern: /final\s+\w+/, points: 2, comment: "Final keyword"},
                {pattern: /\w+\[\s*]/, points: 2, comment: "Array declaration"},
                {pattern: /volatile\s+\w+/, points: 2, comment: "Volatile keyword"},
                {pattern: /transient\s+\w+/, points: 2, comment: "Transient keyword"},

                // Access Modifiers
                {
                    pattern: /(private|protected|public)\s+\w+\s+\w+/,
                    points: 2,
                    comment: "Access modifiers with variables"
                },
                {
                    pattern: /(private|protected|public)\s+\w+\s+\w+\(.+\)/,
                    points: 2,
                    comment: "Access modifiers with methods"
                },

                // Control Structures
                {pattern: /if\s*\(.+\)/, points: 1, comment: "If-else statement"},
                {pattern: /else\s*if\s*\(.+\)/, points: 1, comment: "Else if statement"},
                {pattern: /else/, points: 1, comment: "Else statement"},
                {pattern: /while\s*\(.+\)/, points: 1, comment: "While loop"},
                {pattern: /for\s*\(.+\)/, points: 2, comment: "For loop"},
                {pattern: /switch\s*\(.+\)/, points: 2, comment: "Switch statement"},

                // Methods and Functions
                {pattern: /void\s+\w+\(.*\)/, points: 1, comment: "Void method declaration"},
                {pattern: /synchronized\s+\w+\(.*\)/, points: 2, comment: "Synchronized method"},
                {pattern: /@Override/, points: 2, comment: "Override annotation"},
                {pattern: /\w+\.(get|set)\(.+\)/, points: 2, comment: "Getter and setter methods"},

                // Object and Instance Creation
                {pattern: /new\s+[A-Z]\w*\s*\(.+\)/, points: 2, comment: "Object creation"},

                // Collections and Generics
                {pattern: /(List<\w+>|ArrayList<\w*>\s*\(.+\))\s+\w+/, points: 2, comment: "List and ArrayList"},

                // System and I/O
                {pattern: /System\.(in|out)\.\w+/, points: 2, comment: "System input/output"},

                // Advanced Features
                {pattern: /Stream\s*<.+>\s*\w+/, points: 2, comment: "Stream API"},
                {pattern: /Optional\s*<.+>/, points: 2, comment: "Optional class"},
                {pattern: /@FunctionalInterface/, points: 2, comment: "Functional interface annotation"},
                {pattern: /@SuppressWarnings\(.+\)/, points: 2, comment: "Suppress warnings annotation"},

                // Negative Patterns
                {pattern: /console\.log\(.+\)/, points: -1, comment: "JavaScript console.log (negative)"},
                {pattern: /print\s*\(.+\)/, points: -1, comment: "Python print (negative)"},

                // Additional Patterns
                {pattern: /null/, points: 1, comment: "Null keyword"},
                {
                    pattern: /public\s+static\s+void\s+main\s*\(String\[]\s+\w+\)/,
                    points: 2,
                    comment: "Main method declaration"
                },
                {pattern: /try\s*{/, points: 2, comment: "Try block"},
                {pattern: /catch\s*\(.*\)\s*{/, points: 2, comment: "Catch block"},
                {pattern: /finally\s*{/, points: 2, comment: "Finally block"},
                {pattern: /throw\s+new\s+\w+\(.*\)/, points: 2, comment: "Throw exception"}
            ],


            'html': [
                // Basic HTML Structure
                {pattern: /<!DOCTYPE (html|HTML PUBLIC .+)>/, points: 2, comment: "DOCTYPE declaration", nearTop: true},
                {pattern: /<html>/, points: 2, comment: "HTML tag"},
                {pattern: /<head>/, points: 2, comment: "Head tag"},
                {pattern: /<body>/, points: 2, comment: "Body tag"},

                // Generic HTML Tags
                {
                    pattern: /<[a-z0-9]+(( )*\w+=(["']).+(['"])( )*)?>.*<\/[a-z0-9]+>/,
                    points: 2,
                    comment: "Generic HTML tags"
                },

                // Attributes in Tags
                {pattern: /[a-z\-]+=(["']).+(["'])/, points: 2, comment: "Attributes in tags"},

                // Meta, Link, and Script Tags
                {pattern: /<meta\s+name=["']\w+["']\s+content=["'].*["']\s*\/?>/, points: 2, comment: "Meta tags"},
                {pattern: /<link\s+rel=["']\w+["']\s+href=["'].*["']\s*(\/)?>/, points: 2, comment: "Link tags"},
                {pattern: /<script\s+src=["'].*["']\s*(\/)?>/, points: 2, comment: "Script tags with src attribute"},

                // Image, Audio, and Video Tags
                {pattern: /<img\s+src=["'].*["']\s+alt=["'].*["']\s*(\/)?>/, points: 2, comment: "Image tags"},
                {pattern: /<audio\s+src=["'].*["']\s*(\/)?>/, points: 2, comment: "Audio tags"},
                {pattern: /<video\s+src=["'].*["']\s*(\/)?>/, points: 2, comment: "Video tags"},

                // Commonly Used Tags
                {pattern: /<div\s+class=["']\w+["']>/, points: 2, comment: "Div tags with class attribute"},
                {pattern: /<span\s+style=["'].*["']>/, points: 2, comment: "Span tags with style attribute"},
                {pattern: /<a\s+href=["'].*["']>/, points: 2, comment: "Anchor tags with href attribute"},

                // List, Table, and Form Tags
                {pattern: /<ul\s*>/, points: 2, comment: "Unordered list tags"},
                {pattern: /<ol\s*>/, points: 2, comment: "Ordered list tags"},
                {pattern: /<li\s*>/, points: 2, comment: "List item tags"},
                {pattern: /<table>/, points: 2, comment: "Table tags"},
                {pattern: /<tr>/, points: 2, comment: "Table row tags"},
                {pattern: /<td>/, points: 2, comment: "Table data tags"},
                {pattern: /<th>/, points: 2, comment: "Table header tags"},
                {pattern: /<form\s+action=["'].*["']>/, points: 2, comment: "Form tags with action attribute"},

                // Semantic HTML5 Tags
                {pattern: /<header>/, points: 2, comment: "Header tag"},
                {pattern: /<footer>/, points: 2, comment: "Footer tag"},
                {pattern: /<section>/, points: 2, comment: "Section tag"},
                {pattern: /<article>/, points: 2, comment: "Article tag"},
                {pattern: /<nav>/, points: 2, comment: "Navigation tag"},
                {pattern: /<aside>/, points: 2, comment: "Aside tag"},

                // Negative Pattern
                {pattern: /<\?php/, points: -50, comment: "Embedded PHP (negative points to signify non-HTML)"},

                // Additional Patterns
                {pattern: /<input\s+type=["']\w+["']\s+name=["']\w+["']\s*(\/)?>/, points: 2, comment: "Input tags"},
                {pattern: /<button\s+type=["']\w+["']>/, points: 2, comment: "Button tags"},
                {pattern: /<select\s+name=["']\w+["']>/, points: 2, comment: "Select dropdown tags"},
                {pattern: /<option\s+value=["']\w+["']>/, points: 2, comment: "Option tags"},
                {pattern: /<textarea\s+name=["']\w+["']>/, points: 2, comment: "Textarea tags"}
            ],


            'css': [
                // Basic CSS Properties
                {pattern: /[a-z\-]+:(?!:).+;/, points: 2, comment: "CSS properties"},

                // Negative Pattern
                {pattern: /<(\/)?style>/, points: -50, comment: "HTML style tag (negative points to signify non-CSS)"},

                // Selectors
                {pattern: /\.[a-z\-_]+(\s*){/, points: 2, comment: "Class selectors"},
                {pattern: /#[a-z\-_]+(\s*){/, points: 2, comment: "ID selectors"},
                {pattern: /\w+(\s*)\{/, points: 1, comment: "Element selectors"},
                {pattern: /\*{/, points: 1, comment: "Universal selector"},
                {pattern: /\[.+?]/, points: 2, comment: "Attribute selectors"},

                // Pseudo-classes and Pseudo-elements
                {
                    pattern: /(\w+)(:|::)(before|after|first-letter|first-line|selection)/,
                    points: 2,
                    comment: "Pseudo-elements"
                },
                {pattern: /:hover/, points: 2, comment: "Hover pseudo-class"},
                {pattern: /:active/, points: 2, comment: "Active pseudo-class"},
                {pattern: /:focus/, points: 2, comment: "Focus pseudo-class"},
                {pattern: /:nth-child\(.+\)/, points: 2, comment: "nth-child pseudo-class"},
                {pattern: /:nth-of-type\(.+\)/, points: 2, comment: "nth-of-type pseudo-class"},

                // Advanced CSS Properties
                {pattern: /transition(\s*):/, points: 2, comment: "Transition property"},
                {pattern: /transform(\s*):/, points: 2, comment: "Transform property"},
                {pattern: /animation(\s*):/, points: 2, comment: "Animation property"},
                {pattern: /opacity(\s*):/, points: 2, comment: "Opacity property"},
                {pattern: /border-radius(\s*):/, points: 2, comment: "Border-radius property"},
                {pattern: /box-shadow(\s*):/, points: 2, comment: "Box-shadow property"},
                {pattern: /background-image(\s*):/, points: 2, comment: "Background-image property"},
                {pattern: /linear-gradient\(.+\)/, points: 2, comment: "Linear gradient function"},

                // Layout and Flexbox/Grid
                {pattern: /display(\s*):(\s*)flex/, points: 2, comment: "Flex display"},
                {pattern: /grid-template-columns(\s*):/, points: 2, comment: "Grid columns"},
                {pattern: /grid-template-rows(\s*):/, points: 2, comment: "Grid rows"},
                {pattern: /align-items(\s*):/, points: 2, comment: "Align-items property"},
                {pattern: /justify-content(\s*):/, points: 2, comment: "Justify-content property"},

                // CSS At-Rules
                {pattern: /@import\s+url/, points: 2, comment: "Import rule"},
                {pattern: /@font-face\s*{/, points: 2, comment: "Font-face rule"},
                {pattern: /@media\s*\(.+\)/, points: 2, comment: "Media queries"},
                {pattern: /@keyframes\s+\w+/, points: 2, comment: "Keyframes rule"},

                // Additional Patterns
                {pattern: /position(\s*):/, points: 2, comment: "Position property"},
                {pattern: /z-index(\s*):/, points: 2, comment: "Z-index property"},
                {pattern: /overflow(\s*):/, points: 2, comment: "Overflow property"},
                {pattern: /padding(\s*):/, points: 2, comment: "Padding property"},
                {pattern: /margin(\s*):/, points: 2, comment: "Margin property"},
                {pattern: /color(\s*):/, points: 2, comment: "Color property"},
                {pattern: /font-(size|weight|style)(\s*):/, points: 2, comment: "Font properties"}
            ],


            'ruby': [
                // Import and Modules
                {
                    pattern: /(require|include)( )+'\w+(\.rb)?'/,
                    points: 2,
                    comment: "Require or include methods",
                    nearTop: true
                },
                {pattern: /module\s+\w+/, points: 2, comment: "Module definition"},
                {pattern: /include\s+\w+/, points: 2, comment: "Include module"},
                {pattern: /extend\s+\w+/, points: 2, comment: "Extend module"},
                {pattern: /prepend\s+\w+/, points: 2, comment: "Prepend module"},

                // Class and Method Definitions
                {pattern: /class [A-Z]\w*( )*(< )?([A-Z]\w*(::)?)+/, points: 2, comment: "Class definition"},
                {pattern: /def( )+\w+( )*(\(.+\))?( )*\n/, points: 2, comment: "Function definition"},
                {
                    pattern: /attr_accessor( )+(:\w+(,( )*)?)+/,
                    points: 2,
                    comment: "Attr_accessor for getter and setter"
                },

                // Variables and Accessors
                {pattern: /@\w+/, points: 2, comment: "Instance variable"},
                {pattern: /@@\w+/, points: 2, comment: "Class variable"},
                {pattern: /\$[\w_]+/, points: 2, comment: "Global variable"},

                // Control Structures and Iterators
                {pattern: /if\s+.+/, points: 2, comment: "If condition"},
                {pattern: /elsif/, points: 2, comment: "Elsif condition"},
                {pattern: /else/, points: 1, comment: "Else condition"},
                {pattern: /for\s+\w+\s+in\s+.+/, points: 1, comment: "For loop"},
                {pattern: /while\s+.+/, points: 2, comment: "While loop"},
                {pattern: /do( )*\|(\w+(,( )*\w+)?)+\|/, points: 2, comment: "Block syntax"},
                {pattern: /[\w.]+\.each\s*{/, points: 2, comment: "Each method for iteration"},
                {pattern: /[\w.]+\.map\s*{/, points: 2, comment: "Map method"},
                {pattern: /[\w.]+\.select\s*{/, points: 2, comment: "Select method"},
                {pattern: /[\w.]+\.reject\s*{/, points: 2, comment: "Reject method"},
                {pattern: /[\w.]+\.reduce\s*{/, points: 2, comment: "Reduce method"},

                // Ruby-Specific Constructs
                {pattern: /\.\w+\?/, points: 2, comment: "Method ending with a question mark"},
                {pattern: /puts( )+(["']).+(["'])/, points: 2, comment: "Puts method for output"},
                {pattern: /\w+\.new( )+/, points: 2, comment: "Object instantiation"},
                {pattern: /nil/, points: 1, comment: "Nil keyword"},
                {pattern: /yield/, points: 1, comment: "Yield keyword"},
                {pattern: /raise\s+\w+/, points: 2, comment: "Raise an exception"},
                {pattern: /begin\s+rescue\s+end/, points: 2, comment: "Exception handling"},
                {pattern: /alias\s+\w+\s+\w+/, points: 2, comment: "Alias method"},
                {pattern: /defined?\s+.+/, points: 2, comment: "Defined? keyword"},
                {pattern: /[A-Z]\w*::[A-Z]\w*/, points: 1, comment: "Namespace resolution operator"},
                {pattern: /super/, points: 2, comment: "Super keyword"},

                // Flow Control
                {pattern: /return/, points: 1, comment: "Return keyword"},
                {pattern: /break/, points: 1, comment: "Break keyword"},
                {pattern: /next/, points: 1, comment: "Next keyword"},
                {pattern: /redo/, points: 1, comment: "Redo keyword"},
                {pattern: /retry/, points: 1, comment: "Retry keyword"},
                {pattern: /end/, points: 1, comment: "End keyword"}
            ],


            'go': [
                // Package and Import
                {pattern: /package\s+[a-z]+\n/, points: 2, comment: "Package declaration", nearTop: true},
                {
                    pattern: /import\s*\((.*?)\)/s,
                    points: 2,
                    comment: "Import statements with parentheses",
                    nearTop: true
                },
                {pattern: /import\s+"[a-z0-9\/.]+"/, points: 2, comment: "Single import statement", nearTop: true},

                // Functions and Methods
                {pattern: /func\s+(\w+\s*)?\(.*\)(\s+\w+)?\s*{/, points: 2, comment: "Function declaration"},
                {pattern: /go\s+func\(\)\s*{/, points: 2, comment: "Go routine"},
                {pattern: /defer\s+\w+/, points: 2, comment: "Defer statement"},

                // Control Structures
                {pattern: /if\s+.*err\s*!=\s*nil\s*{/, points: 2, comment: "Error checking"},
                {pattern: /else\s*if\s+.+{/, points: 2, comment: "Else if statement"},
                {pattern: /for\s+(\w+\s+:=\s+)?range\s+\w+/, points: 2, comment: "For range loop"},
                {pattern: /switch\s+\w+\s*{/, points: 2, comment: "Switch statement"},
                {pattern: /case\s+\w+:/, points: 1, comment: "Case in switch"},
                {pattern: /default:/, points: 1, comment: "Default case"},

                // Variables and Types
                {pattern: /\w+\s*:=\s*.+/, points: 2, comment: "Short variable declaration"},
                {pattern: /(var|const)\s+\w+\s+[\w*]+(\s*=\s*.*|;)/, points: 2, comment: "Var and const declaration"},
                {pattern: /struct\s+\{/, points: 2, comment: "Struct declaration"},
                {pattern: /type\s+\w+\s+struct\s*{/, points: 2, comment: "Type declaration for struct"},
                {pattern: /map\[.*]/, points: 1, comment: "Map declaration"},
                {pattern: /interface\s*{/, points: 2, comment: "Interface declaration"},

                // Concurrency
                {pattern: /goroutine/, points: 2, comment: "Goroutine keyword"},
                {pattern: /select\s*{/, points: 2, comment: "Select statement"},
                {pattern: /channel\s*<-\s*\w+/, points: 2, comment: "Channel operation"},
                {pattern: /make\(\s*chan\s+\w+/, points: 2, comment: "Make channel"},
                {pattern: /close\(\w+\)/, points: 1, comment: "Close channel"},

                // Common Functions and Operations
                {pattern: /fmt\.Print(f|ln)?\(.*\)/, points: 2, comment: "Print statements"},
                {pattern: /append\(\w+, \w+\)/, points: 2, comment: "Append function"},
                {pattern: /len\(\w+\)/, points: 1, comment: "Length function"},
                {pattern: /cap\(\w+\)/, points: 1, comment: "Capacity function"},
                {pattern: /copy\(\w+, \w+\)/, points: 2, comment: "Copy function"},
                {pattern: /return\s+\w+/, points: 1, comment: "Return statement"},
                {pattern: /range\s+\w+/, points: 2, comment: "Range clause"},

                // Naming Conventions and Exported Names
                {pattern: /[A-Z]\w*::[A-Z]\w*/, points: 1, comment: "Namespace resolution operator"},
                {pattern: /[a-z]+\.[A-Z]\w*/, points: 1, comment: "Exported names"},

                // Additional Keywords
                {pattern: /nil/, points: 1, comment: "Nil keyword"}
            ],


            'php': [
                // Basic PHP Syntax
                {pattern: /<\?php/, points: 2, comment: "PHP opening tag"},
                {pattern: /\$\w+/, points: 2, comment: "Variable"},
                {pattern: /echo\s+(['"]).+(['"]);/, points: 1, comment: "Echo statement"},
                {pattern: /NULL/, points: 1, comment: "NULL keyword"},
                {pattern: /new\s+((\\\w+)+|\w+)(\(.*\))?/, points: 1, comment: "New keyword for object creation"},
                {pattern: /function\s+[$\w]+\s*\(.+\)/, points: 1, comment: "Function definition"},
                {pattern: /namespace\s+\w+;/, points: 2, comment: "Namespace declaration"},
                {pattern: /use\s+\w+(\\\w+)+\s*;/, points: 2, comment: "Namespace use", nearTop: true},
                {pattern: /->/, points: 1, comment: "Object operator"},

                // Control Structures
                {pattern: /if\s+\(.+\)/, points: 1, comment: "If statement"},
                {pattern: /else\s+if\s+\(.+\)/, points: 1, comment: "Else if statement"},
                {pattern: /foreach\s+\(.+\)/, points: 2, comment: "Foreach loop"},
                {pattern: /for\s+\(.+\)/, points: 1, comment: "For loop"},
                {pattern: /while\s+\(.+\)/, points: 1, comment: "While loop"},
                {pattern: /switch\s+\(.+\)/, points: 1, comment: "Switch statement"},

                // Class and Object Usage
                {pattern: /class\s+[A-Z]\w*/, points: 2, comment: "Class definition"},
                {pattern: /\$\w+->\w+/, points: 2, comment: "Object property access"},
                {pattern: /public\s+function\s+\w+/, points: 2, comment: "Public method"},
                {pattern: /private\s+function\s+\w+/, points: 2, comment: "Private method"},
                {pattern: /protected\s+function\s+\w+/, points: 2, comment: "Protected method"},
                {pattern: /public\s+static\s+function\s+\w+/, points: 2, comment: "Public static method"},
                {pattern: /private\s+static\s+function\s+\w+/, points: 2, comment: "Private static method"},
                {pattern: /protected\s+static\s+function\s+\w+/, points: 2, comment: "Protected static method"},
                {pattern: /\btrait\b/, points: 2, comment: "Trait keyword"},
                {pattern: /\bimplements\b/, points: 2, comment: "Implements keyword"},
                {pattern: /__construct/, points: 2, comment: "Constructor method"},
                {pattern: /__destruct/, points: 2, comment: "Destructor method"},

                // Common PHP Functions and Operations
                {
                    pattern: /(require|include)(_once)?\s*\(?\s*(['"]).+\.php(['"])\s*\)?\s*;/,
                    points: 2,
                    comment: "Require/include"
                },
                {pattern: /array\s*\(.+\)/, points: 2, comment: "Array"},
                {pattern: /isset\s*\(\s*\$\w+\s*\)/, points: 2, comment: "Isset function"},
                {pattern: /empty\s*\(\s*\$\w+\s*\)/, points: 2, comment: "Empty function"},
                {pattern: /@param\s+\w+\s+\$\w+/, points: 2, comment: "DocBlock @param tag"},
                {pattern: /@return\s+\w+/, points: 2, comment: "DocBlock @return tag"},
                {pattern: /global\s+\$\w+/, points: 2, comment: "Global keyword"},
                {pattern: /static\s+\$\w+/, points: 2, comment: "Static variable"},
                {pattern: /public\s+\$\w+/, points: 2, comment: "Public property"},
                {pattern: /private\s+\$\w+/, points: 1, comment: "Private property"},
                {pattern: /protected\s+\$\w+/, points: 1, comment: "Protected property"},

                // Operators and Syntax
                {pattern: /===/, points: 1, comment: "Strict equality"},
                {pattern: /!==/, points: 1, comment: "Strict inequality"},
                {pattern: /\w+::\w+/, points: 1, comment: "Static method or property"},
                {pattern: /::(class|function)/, points: 2, comment: "Scope resolution operator"}
            ],

            'csharp': [
                // Namespace and Using Directives
                {pattern: /using\s+\w+(\.\w+)*;/, points: 2, comment: "Namespace using directive"},
                {pattern: /\bnamespace\b\s+\w+/, points: 2, comment: "Namespace declaration"},

                // Class, Interface, Enum, and Struct Declarations
                {
                    pattern: /(public|private|protected|internal)\s+(class|interface|enum|struct)\s+\w+/,
                    points: 2,
                    comment: "Class, interface, enum, or struct declaration"
                },

                // Method Declarations
                {
                    pattern: /(public|private|protected|internal)\s+\w+\s+\w+\(.*\)/,
                    points: 2,
                    comment: "Method declaration"
                },
                {pattern: /static\s+void\s+Main\s*\(\s*string\[]\s+\w*\s*\)/, points: 2, comment: "Main method"},
                {pattern: /async\s+Task/, points: 2, comment: "Async Task method"},

                // Properties and Fields
                {
                    pattern: /(public|private|protected|internal)\s+\w+\s+\{\s+get;\s+set;\s+}/,
                    points: 2,
                    comment: "Property with getter and setter"
                },
                {pattern: /public\s+enum\s+\w+/, points: 2, comment: "Enum declaration"},
                {pattern: /readonly\s+\w+\s+\w+/, points: 2, comment: "Readonly field"},
                {pattern: /const\s+\w+\s+\w+/, points: 2, comment: "Const declaration"},

                // Keywords and Common C# Constructs
                {
                    pattern: /\b(var|async|await|yield|get|set|value)\b/,
                    points: 2,
                    comment: "Keywords for async, iterators, and properties"
                },
                {pattern: /delegate\s+\w+/, points: 2, comment: "Delegate declaration"},
                {pattern: /event\s+\w+\s+\w+;/, points: 2, comment: "Event declaration"},
                {pattern: /Action<.*>/, points: 2, comment: "Action delegate"},
                {pattern: /Func<.*>/, points: 2, comment: "Func delegate"},

                // LINQ and Collections
                {pattern: /from\s+\w+\s+in\s+\w+\s+where\s+.*\s+select\s+.*/, points: 2, comment: "LINQ query syntax"},
                {pattern: /IEnumerable<\w+>/, points: 2, comment: "IEnumerable for collections"},
                {pattern: /List<\w+>/, points: 2, comment: "List type"},
                {pattern: /Dictionary<\w+,\s*\w+>/, points: 2, comment: "Dictionary type"},
                {pattern: /HashSet<\w+>/, points: 2, comment: "HashSet type"},

                // String and Console Operations
                {pattern: /\$@?".+"/, points: 2, comment: "String interpolation"},
                {pattern: /Console\.Write(Line)?\(/, points: 2, comment: "Console write/read"},
                {pattern: /string\s+\w+\s*=\s*".*";/, points: 2, comment: "String declaration"},

                // Exception Handling
                {pattern: /throw\s+new\s+\w+/, points: 2, comment: "Throw exception"},
                {pattern: /catch\s*\(.*\)/, points: 2, comment: "Catch block"},
                {pattern: /finally\s*{/, points: 2, comment: "Finally block"},

                // Attributes and Annotations
                {pattern: /\[\w+\(\)]/, points: 2, comment: "Attribute"},
                {pattern: /\[HttpPost]/, points: 2, comment: "HttpPost attribute"},
                {pattern: /\[HttpGet]/, points: 2, comment: "HttpGet attribute"},

                // ASP.NET and EntityFramework
                {pattern: /IActionResult/, points: 2, comment: "IActionResult in ASP.NET"},
                {pattern: /DbContext/, points: 2, comment: "DbContext in EntityFramework"},
                {pattern: /EntityFramework/, points: 2, comment: "EntityFramework reference"},

                // Lambda Expressions and Operators
                {pattern: /\w+ => \w+/, points: 2, comment: "Lambda expression"},
                {pattern: /=>/, points: 1, comment: "Lambda arrow"},
                {pattern: /[\w.]+\?.\w+/, points: 2, comment: "Null-conditional operator"},

                // Comments
                {pattern: /\/\/.+/, points: 1, comment: "Single-line comment"},
                {pattern: /\/\*[\s\S]*?\*\//, points: 1, comment: "Multi-line comment"},

                // Generics
                {pattern: /\w+<\w+>/, points: 2, comment: "Generic type"},

                // Various LINQ Methods
                {pattern: /[\w.]+\.FirstOrDefault\(/, points: 2, comment: "LINQ FirstOrDefault"},
                {pattern: /[\w.]+\.Any\(/, points: 2, comment: "LINQ Any method"},
                {pattern: /[\w.]+\.ToList\(/, points: 2, comment: "LINQ ToList method"},
                {pattern: /[\w.]+\.OrderBy\(/, points: 2, comment: "LINQ OrderBy method"},
                {pattern: /[\w.]+\.OrderByDescending\(/, points: 2, comment: "LINQ OrderByDescending method"},
                {pattern: /[\w.]+\.Select\(/, points: 2, comment: "LINQ Select method"},
                {pattern: /[\w.]+\.Where\(/, points: 2, comment: "LINQ Where method"},
                {pattern: /[\w.]+\.GroupBy\(/, points: 2, comment: "LINQ GroupBy method"},
                {pattern: /[\w.]+\.Count\(/, points: 2, comment: "LINQ Count method"},
                {pattern: /[\w.]+\.Sum\(/, points: 2, comment: "LINQ Sum method"},
                {pattern: /[\w.]+\.Average\(/, points: 2, comment: "LINQ Average method"},
                {pattern: /[\w.]+\.Max\(/, points: 2, comment: "LINQ Max method"},
                {pattern: /[\w.]+\.Min\(/, points: 2, comment: "LINQ Min method"},
                {pattern: /[\w.]+\.Where\(/, points: 2, comment: "LINQ Where method"},
                {pattern: /[\w.]+\.Select\(/, points: 2, comment: "LINQ Select method"},
                {pattern: /[\w.]+\.OrderBy\(/, points: 2, comment: "LINQ OrderBy method"},
                {pattern: /[\w.]+\.OrderByDescending\(/, points: 2, comment: "LINQ OrderByDescending method"},
                {pattern: /[\w.]+\.GroupBy\(/, points: 2, comment: "LINQ GroupBy method"},
                {pattern: /[\w.]+\.Join\(/, points: 2, comment: "LINQ Join method"},
                {pattern: /[\w.]+\.GroupJoin\(/, points: 2, comment: "LINQ GroupJoin method"},
                {pattern: /[\w.]+\.SelectMany\(/, points: 2, comment: "LINQ SelectMany method"},
                {pattern: /[\w.]+\.All\(/, points: 2, comment: "LINQ All method"},
                {pattern: /[\w.]+\.Sum\(/, points: 2, comment: "LINQ Sum method"},
                {pattern: /[\w.]+\.Count\(/, points: 2, comment: "LINQ Count method"},
                {pattern: /[\w.]+\.Average\(/, points: 2, comment: "LINQ Average method"},
                {pattern: /[\w.]+\.Max\(/, points: 2, comment: "LINQ Max method"},
                {pattern: /[\w.]+\.Min\(/, points: 2, comment: "LINQ Min method"},
                {pattern: /[\w.]+\.Concat\(/, points: 2, comment: "LINQ Concat method"},
                {pattern: /[\w.]+\.Distinct\(/, points: 2, comment: "LINQ Distinct method"},
                {pattern: /[\w.]+\.Intersect\(/, points: 2, comment: "LINQ Intersect method"},
                {pattern: /[\w.]+\.Except\(/, points: 2, comment: "LINQ Except method"},
                {pattern: /[\w.]+\.Reverse\(/, points: 2, comment: "LINQ Reverse method"},
                {pattern: /[\w.]+\.Zip\(/, points: 2, comment: "LINQ Zip method"},
                {pattern: /[\w.]+\.Aggregate\(/, points: 2, comment: "LINQ Aggregate method"},

                // Miscellaneous Unity
                {pattern: /var\s+\w+\s*=\s*new\s+\w+/, points: 2, comment: "Var keyword with object initialization"},
                {pattern: /\[\w+(\(.*\))?\]/, points: 2, comment: "Attribute usage"},
                {pattern: /\.\w+\(.*=>.*\)/, points: 2, comment: "LINQ method syntax"},
                {pattern: /using (System|UnityEngine|Unity\.Services).*;/, points: 2, comment: "Common C# namespaces"},
                {
                    pattern: /private \w+ _\w+;[\s\S]*public \w+ \w+ \{ get; set; \}/,
                    points: 2,
                    comment: "Full property definition with backing field"
                },
                {pattern: /public void (Start|Update)\(\)/, points: 3, comment: "Common Unity methods"},
                {pattern: /public \w+<\w+>\(\)/, points: 2, comment: "Generic method"},
                {pattern: /async Task<\w+> \w+\(.*\)/, points: 2, comment: "Async method with return type"},
                {pattern: /public event \w+ \w+;/, points: 2, comment: "Event declaration"},
                {pattern: /string\.Format\(|\$\@?".*"\+/, points: 2, comment: "String format or concatenation"},
                {
                    pattern: /try\s*{[\s\S]*?} catch\s*\(.*\)\s*{[\s\S]*?}( finally\s*{[\s\S]*?})?/,
                    points: 2,
                    comment: "Try-catch-finally block"
                },
                {pattern: /GetComponent<\w+>\(\)/, points: 3, comment: "Unity GetComponent method"},
                {pattern: /Instantiate\(.*\)/, points: 3, comment: "Unity Instantiate method"},
                {pattern: /Debug\.Log(Warning|Error)?\(/, points: 2, comment: "Unity Debug methods"},
                {pattern: /\[SerializeField\]/, points: 2, comment: "Unity SerializeField attribute"},
                {pattern: /MonoBehaviour/, points: 3, comment: "Unity MonoBehaviour"},
                {pattern: /Transform\.position/, points: 2, comment: "Unity Transform property"},
                {pattern: /Vector(2|3)\./, points: 2, comment: "Unity Vector usage"},
                {pattern: /Rigidbody2D|Collider2D/, points: 3, comment: "Unity Physics components"},
                {pattern: /\[\w+(\(.*\))?\]/, points: 2, comment: "Attribute usage"},
                {pattern: /\.\w+\(.*=>.*\)/, points: 2, comment: "LINQ method syntax"},
                {pattern: /using (System|UnityEngine|Unity\.Services).*;/, points: 2, comment: "Common C# namespaces"},
                {
                    pattern: /private \w+ _\w+;[\s\S]*public \w+ \w+ \{ get; set; \}/,
                    points: 2,
                    comment: "Full property definition with backing field"
                },
                {
                    pattern: /public void (Start|Update|Awake|FixedUpdate|LateUpdate)\(\)/,
                    points: 3,
                    comment: "Common Unity lifecycle methods"
                },
                {pattern: /public \w+<\w+>\(\)/, points: 2, comment: "Generic method"},
                {pattern: /async Task<\w+> \w+\(.*\)/, points: 2, comment: "Async method with return type"},
                {pattern: /public event \w+ \w+;/, points: 2, comment: "Event declaration"},
                {pattern: /string\.Format\(|\$\@?".*"\+/, points: 2, comment: "String format or concatenation"},
                {
                    pattern: /try\s*{[\s\S]*?} catch\s*\(.*\)\s*{[\s\S]*?}( finally\s*{[\s\S]*?})?/,
                    points: 2,
                    comment: "Try-catch-finally block"
                },
                {pattern: /GetComponent<\w+>\(\)/, points: 3, comment: "Unity GetComponent method"},
                {pattern: /Instantiate\(.*\)/, points: 3, comment: "Unity Instantiate method"},
                {pattern: /Debug\.Log(Warning|Error)?\(/, points: 2, comment: "Unity Debug methods"},
                {pattern: /\[SerializeField\]/, points: 2, comment: "Unity SerializeField attribute"},
                {pattern: /MonoBehaviour/, points: 3, comment: "Unity MonoBehaviour"},
                {pattern: /Transform\.position/, points: 2, comment: "Unity Transform property"},
                {pattern: /Vector(2|3)\./, points: 2, comment: "Unity Vector usage"},
                {pattern: /Rigidbody2D|Collider2D/, points: 3, comment: "Unity Physics components"},
                {pattern: /Input\.Get(Key|ButtonDown|Axis)/, points: 3, comment: "Unity Input system"},
                {pattern: /Animator|Animation/, points: 3, comment: "Unity Animation components"},
                {pattern: /UnityEngine\.UI\./, points: 3, comment: "Unity UI components"},
                {pattern: /Physics(Raycast|Overlap)/, points: 3, comment: "Unity Physics methods"},
                {pattern: /LayerMask/, points: 2, comment: "Unity LayerMask"},
                {pattern: /AudioSource|AudioClip/, points: 3, comment: "Unity Audio components"},
                {pattern: /Camera\.main/, points: 2, comment: "Unity Camera access"},
                {pattern: /Quaternion\./, points: 2, comment: "Unity Quaternion usage"},
                {pattern: /Mathf\./, points: 2, comment: "Unity Mathf usage"},
                {pattern: /SpriteRenderer|MeshRenderer/, points: 3, comment: "Unity Renderer components"},
                {pattern: /Time\.(deltaTime|time)/, points: 2, comment: "Unity Time class"},
                {pattern: /NavMeshAgent/, points: 3, comment: "Unity AI Navigation"},
                {pattern: /SceneManager\.LoadScene/, points: 3, comment: "Unity Scene management"},
                {pattern: /PlayerPrefs(Get|Set)/, points: 3, comment: "Unity PlayerPrefs"},
                {pattern: /Coroutine|IEnumerator/, points: 3, comment: "Unity Coroutines"},
                {
                    pattern: /OnCollision(Enter|Exit)|OnTrigger(Enter|Exit)/,
                    points: 3,
                    comment: "Unity Collision and Trigger methods"
                },
                {
                    pattern: /Application\.(quit|loadLevel|isPlaying)/,
                    points: 2,
                    comment: "Unity Application class methods"
                },
                {pattern: /Resources\.Load/, points: 3, comment: "Unity Resources Load"},
                {
                    pattern: /GameObject\.Find(WithTag|ObjectOfType)/,
                    points: 3,
                    comment: "Unity GameObject find methods"
                },
                {pattern: /Light|MeshFilter|ParticleEmitter/, points: 3, comment: "Unity various components"}

            ],


            'sql': [
                // Basic SQL Commands
                {pattern: /\b(SELECT|INSERT INTO|UPDATE|DELETE FROM)\b/, points: 2, comment: "Basic SQL commands"},

                // Clauses and Keywords
                {pattern: /\bWHERE\b/, points: 2, comment: "WHERE clause"},
                {pattern: /\bGROUP BY\b/, points: 2, comment: "GROUP BY clause"},
                {pattern: /\bHAVING\b/, points: 2, comment: "HAVING clause"},
                {pattern: /\bORDER BY\b/, points: 1, comment: "ORDER BY clause"},
                {pattern: /\bLIMIT\b/, points: 1, comment: "LIMIT clause"},
                {pattern: /\bOFFSET\b/, points: 1, comment: "OFFSET clause"},
                {pattern: /\bUNION( ALL)?\b/, points: 2, comment: "UNION/UNION ALL command"},
                {pattern: /\bDISTINCT\b/, points: 2, comment: "DISTINCT keyword"},
                {pattern: /\bIN\b/, points: 2, comment: "IN keyword"},
                {pattern: /\bLIKE\b/, points: 2, comment: "LIKE operator"},
                {pattern: /\bBETWEEN\b/, points: 2, comment: "BETWEEN operator"},
                {pattern: /\bIS (NOT )?NULL\b/, points: 2, comment: "IS NULL/IS NOT NULL condition"},
                {pattern: /\bEXISTS\b/, points: 2, comment: "EXISTS condition"},
                {pattern: /\bCASE\b/, points: 1, comment: "CASE statement"},
                {pattern: /\bWHEN\b/, points: 1, comment: "WHEN clause"},
                {pattern: /\bTHEN\b/, points: 1, comment: "THEN clause"},
                {pattern: /\bELSE\b/, points: 1, comment: "ELSE clause"},
                {pattern: /\bEND\b/, points: 1, comment: "END keyword"},

                // JOIN Operations
                {
                    pattern: /\b(JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN)\b/,
                    points: 2,
                    comment: "JOIN operations"
                },

                // Aggregate Functions
                {pattern: /\b(SUM|COUNT|AVG|MIN|MAX)\b/, points: 2, comment: "Aggregate functions"},

                // Data Definition Language (DDL)
                {
                    pattern: /\bCREATE (TABLE|VIEW|INDEX|PROCEDURE|FUNCTION)\b/,
                    points: 2,
                    comment: "CREATE TABLE/VIEW/INDEX/PROCEDURE/FUNCTION command"
                },
                {pattern: /\bALTER TABLE\b/, points: 2, comment: "ALTERTABLE command"},
                {
                    pattern: /\bDROP (TABLE|VIEW|INDEX|PROCEDURE|FUNCTION)\b/,
                    points: 2,
                    comment: "DROP TABLE/VIEW/INDEX/PROCEDURE/FUNCTION command"
                },
                {pattern: /\bTRUNCATE TABLE\b/, points: 2, comment: "TRUNCATE TABLE command"},

                // Data Types and Constraints
                {
                    pattern: /\b(INT|VARCHAR|CHAR|TEXT|DATE|DECIMAL|FLOAT|DOUBLE)\b/,
                    points: 1,
                    comment: "Common data types"
                },
                {pattern: /\bPRIMARY KEY\b/, points: 1, comment: "PRIMARY KEY constraint"},
                {pattern: /\bUNIQUE\b/, points: 1, comment: "UNIQUE constraint"},
                {pattern: /\bCHECK\b/, points: 1, comment: "CHECK constraint"},
                {pattern: /\bFOREIGN KEY\b/, points: 1, comment: "FOREIGN KEY constraint"},
                {pattern: /\bINDEX\b/, points: 2, comment: "INDEX command"},
                {pattern: /\bVIEW\b/, points: 2, comment: "VIEW command"},
                {pattern: /\bPROCEDURE\b/, points: 2, comment: "PROCEDURE command"},
                {pattern: /\bFUNCTION\b/, points: 2, comment: "FUNCTION command"},

                // Comments
                {pattern: /--.*$|\/\*[\s\S]*?\*\//, points: 1, comment: "SQL comments"},

                // Subqueries
                {pattern: /\bSELECT\b.*\bFROM\b.*\b(SELECT\b)/, points: 2, comment: "Subquery"},

                // Functions and Expressions
                {pattern: /\bCAST\(.+\bAS\b/, points: 2, comment: "CAST function"},
                {pattern: /\bCONVERT\(.+\bAS\b/, points: 2, comment: "CONVERT function"},
                {pattern: /\bCOALESCE\(/, points: 2, comment: "COALESCE function"},
                {pattern: /\bSUBSTRING\(/, points: 2, comment: "SUBSTRING function"},
                {pattern: /\bCHAR_LENGTH\(/, points: 2, comment: "CHAR_LENGTH function"},
                {pattern: /\bCURRENT_DATE\b/, points: 2, comment: "CURRENT_DATE function"},
                {pattern: /\bCURRENT_TIME\b/, points: 2, comment: "CURRENT_TIME function"},
                {pattern: /\bCURRENT_TIMESTAMP\b/, points: 2, comment: "CURRENT_TIMESTAMP function"},

            ],


            'typeScript': [
                // TypeScript-specific Types
                {
                    pattern: /\b(string|number|boolean|any|void|never)\b/,
                    points: 2,
                    comment: "TypeScript-specific types"
                },

                // Declarations and Annotations
                {pattern: /\binterface\b/, points: 2, comment: "Interface declaration"},
                {pattern: /\benum\b/, points: 2, comment: "Enum declaration"},
                {pattern: /\w+:\s*\w+/, points: 2, comment: "Type annotations"},
                {pattern: /\btype\b\s+\w+/, points: 2, comment: "Type alias"},
                {pattern: /\bconst\b/, points: 2, comment: "const keyword"},
                {pattern: /\blet\b/, points: 2, comment: "let keyword"},
                {pattern: /\bclass\b/, points: 2, comment: "class keyword"},
                {pattern: /\bfunction\b/, points: 1, comment: "function keyword"},

                // Generics, Decorators, and Modifiers
                {pattern: /\b\w+<\w+>\b/, points: 2, comment: "Generics"},
                {pattern: /<\w+>\w+/, points: 2, comment: "Type assertions"},
                {pattern: /@\w+/, points: 2, comment: "Decorators"},
                {pattern: /\b(public|private|protected)\b/, points: 1, comment: "Access modifiers"},
                {pattern: /\breadonly\b/, points: 1, comment: "Readonly modifier"},
                {pattern: /\bextends\b/, points: 2, comment: "extends keyword"},
                {pattern: /\bimplements\b/, points: 2, comment: "implements keyword"},

                // Control Structures and Keywords
                {pattern: /\bif\b/, points: 1, comment: "if statement"},
                {pattern: /\belse\b/, points: 1, comment: "else keyword"},
                {pattern: /\bfor\b/, points: 1, comment: "for loop"},
                {pattern: /\bwhile\b/, points: 1, comment: "while loop"},
                {pattern: /\bswitch\b/, points: 1, comment: "switch statement"},
                {pattern: /\bcase\b/, points: 1, comment: "case keyword in switch"},
                {pattern: /\bdefault\b/, points: 1, comment: "default keyword in switch"},
                {pattern: /\btry\b/, points: 1, comment: "try keyword"},
                {pattern: /\bcatch\b/, points: 1, comment: "catch keyword"},
                {pattern: /\bfinally\b/, points: 1, comment: "finally keyword"},
                {pattern: /\breturn\b/, points: 1, comment: "return keyword"},
                {pattern: /\bthrow\b/, points: 1, comment: "throw keyword"},
                {pattern: /\bnew\b/, points: 1, comment: "new keyword"},

                // Asynchronous Programming
                {pattern: /\basync\b/, points: 2, comment: "async keyword"},
                {pattern: /\bawait\b/, points: 2, comment: "await keyword"},
                {pattern: /\byield\b/, points: 2, comment: "yield keyword"},

                // Modules and Import/Export
                {pattern: /\b(module|namespace)\b/, points: 1, comment: "Modules and Namespaces"},
                {pattern: /\bimport\b/, points: 2, comment: "import statement"},
                {pattern: /\bexport\b/, points: 2, comment: "export statement"},
                {pattern: /\bfrom\b/, points: 1, comment: "from keyword in import/export"},
                {pattern: /\brequire\b/, points: 2, comment: "require statement"},

                // Additional TypeScript Features
                {pattern: /\[\w+(,\s*\w+)*]/, points: 1, comment: "Tuple types"},
                {pattern: /\?\./, points: 1, comment: "Optional chaining"},
                {pattern: /\?\?/, points: 1, comment: "Nullish coalescing"},
                {pattern: /\bas\s+\w+/, points: 1, comment: "Type guards and type casting"},
                {pattern: /\bkeyof\b/, points: 1, comment: "Keyof keyword"},
                {pattern: /\b(typeof|instanceof)\b/, points: 1, comment: "Typeof and Instanceof"},
                {pattern: /\bthis\b/, points: 1, comment: "this keyword"},
                {pattern: /\bsuper\b/, points: 1, comment: "super keyword"},
                {pattern: /\b(of|in)\b/, points: 1, comment: "'of' keyword in for...of loop, 'in' keyword"},

            ],

            'swift': [
                // Function, Class, Struct, Enum, Protocol, and Extension Declarations
                {pattern: /func\s+\w+\(.*\)\s*->\s*\w+/, points: 2, comment: "Function declaration"},
                {pattern: /class\s+\w+(:\s*\w+)?\s*{/, points: 2, comment: "Class declaration"},
                {pattern: /struct\s+\w+\s*{/, points: 2, comment: "Struct declaration"},
                {pattern: /enum\s+\w+\s*{/, points: 2, comment: "Enum declaration"},
                {pattern: /protocol\s+\w+\s*{/, points: 2, comment: "Protocol declaration"},
                {pattern: /extension\s+\w+\s*{/, points: 2, comment: "Extension declaration"},

                // Variable and Constant Declarations
                {pattern: /var\s+\w+:\s*\w+/, points: 2, comment: "Variable declaration"},
                {pattern: /let\s+\w+:\s*\w+/, points: 2, comment: "Constant declaration"},

                // Swift Specific Keywords and Constructs
                {pattern: /\b(self|guard|defer|inout|enum)\b/, points: 1, comment: "Swift specific keywords"},
                {pattern: /\?\?/, points: 1, comment: "Nullish coalescing"},
                {pattern: /\?\./, points: 1, comment: "Optional chaining"},
                {pattern: /\bas\?/, points: 2, comment: "Optional type casting"},
                {pattern: /\bas!/, points: 2, comment: "Forced type casting"},
                {pattern: /\bif\b/, points: 1, comment: "If statement"},
                {pattern: /\belse\b/, points: 1, comment: "Else statement"},
                {pattern: /\bguard\s+.*\s+else\s*{/, points: 1, comment: "Guard statement"},

                // Control Flow and Loop Constructs
                {pattern: /\bfor\b/, points: 1, comment: "For loop"},
                {pattern: /\bin\b/, points: 1, comment: "In keyword"},
                {pattern: /\bwhile\b/, points: 1, comment: "While loop"},
                {pattern: /\bswitch\b/, points: 1, comment: "Switch statement"},
                {pattern: /\bcase\b/, points: 1, comment: "Case in switch"},
                {pattern: /\bdefault\b/, points: 1, comment: "Default in switch"},
                {pattern: /\bbreak\b/, points: 1, comment: "Break statement"},
                {pattern: /\bfallthrough\b/, points: 1, comment: "Fallthrough in switch"},

                // Error Handling
                {pattern: /\bdo\b/, points: 2, comment: "Do statement"},
                {pattern: /\bcatch\b/, points: 2, comment: "Catch statement"},
                {pattern: /\bthrow\b/, points: 2, comment: "Throw statement"},
                {pattern: /\btry\b/, points: 2, comment: "Try statement"},

                // Access Modifiers and Annotations
                {pattern: /\b(public|private|protected|internal)\b/, points: 1, comment: "Access modifiers"},
                {pattern: /\breadonly\b/, points: 1, comment: "Readonly modifier"},
                {pattern: /@\w+/, points: 1, comment: "Annotations"},

                // Optional Types and Type Aliases
                {pattern: /\w+\?\s*([={])/, points: 2, comment: "Optional type"},
                {pattern: /typealias\s+\w+/, points: 2, comment: "Type alias"},

                // Import Statement and Compile-time Conditional
                {pattern: /import\s+\w+/, points: 2, comment: "Import statement"},
                {pattern: /#if/, points: 2, comment: "Compile-time conditional"},
                {pattern: /#endif/, points: 2, comment: "End of compile-time conditional"},
                {pattern: /#else/, points: 2, comment: "Else in compile-time conditional"},
                {pattern: /#elseif/, points: 2, comment: "Else if in compile-time conditional"},
                {pattern: /#available/, points: 2, comment: "Availability check"},
                {pattern: /#error/, points: 2, comment: "Compile-time error"},
                {pattern: /#warning/, points: 2, comment: "Compile-time warning"},

                // Swift UI and Related Patterns
                {pattern: /@objc/, points: 2, comment: "Objective-C compatibility"},
                {pattern: /@IBOutlet/, points: 2, comment: "Interface Builder outlet"},
                {pattern: /@IBAction/, points: 2, comment: "Interface Builder action"},
                {pattern: /@IBDesignable/, points: 2, comment: "Interface Builder designable"},
                {pattern: /@IBInspectable/, points: 2, comment: "Interface Builder inspectable"},
                {pattern: /@autoclosure/, points: 2, comment: "Auto-closure"},
                {pattern: /@escaping/, points: 2, comment: "Escaping closure"},
                {pattern: /@nonobjc/, points: 2, comment: "Non Objective-C"},
                {pattern: /@UIApplicationMain/, points: 2, comment: "Main UIApplication class"},


                // Closures and Function Types
                {pattern: /->\s*\w+/, points: 1, comment: "Closure return type"},
                {pattern: /inout\s+\w+/, points: 1, comment: "Inout parameters"},
                {pattern: /->\s*Void/, points: 1, comment: "Void return type in closures"},
                {pattern: /@discardableResult/, points: 2, comment: "Discardable result"},
                {pattern: /@Published/, points: 2, comment: "Published property wrapper"},
                {pattern: /@ObservableObject/, points: 2, comment: "Observable object"},

                // Swift UI View Modifiers
                {pattern: /\.onAppear\(\)/, points: 2, comment: "View modifier"},
                {pattern: /\.onDisappear\(\)/, points: 2, comment: "View modifier"},


                // Return, Continue, and Deinitializer
                {pattern: /\breturn\b/, points: 1, comment: "Return statement"},
                {pattern: /\bcontinue\b/, points: 1, comment: "Continue statement"},
                {pattern: /\bdeinit\b/, points: 2, comment: "Deinitializer"},

                // Weak and Unowned References
                {pattern: /\bweak\b/, points: 2, comment: "Weak reference"},
                {pattern: /\bunowned\b/, points: 2, comment: "Unowned reference"},

                // Other Swift-specific Patterns
                {pattern: /@available\(.*\)/, points: 2, comment: "Availability condition"},

            ],

            'objectivec': [
                // Import and Declaration Statements
                {pattern: /#import\s+<\w+\/\w+\.h>/, points: 2, comment: "Import statement"},
                {pattern: /@interface\s+\w+\s*:\s*\w+/, points: 2, comment: "Interface declaration"},
                {pattern: /@implementation\s+\w+/, points: 2, comment: "Implementation declaration"},
                {pattern: /@protocol\s+\w+/, points: 2, comment: "Protocol declaration"},

                // Method Declarations
                {pattern: /[-+]\s*\(\w+\s*\*\)\w+:/, points: 2, comment: "Method declaration"},

                // Property, Synthesize, and Dynamic Statements
                {pattern: /@property\s*\(.*\)\s*\w+\s*\*\w+;/, points: 2, comment: "Property declaration"},
                {pattern: /@synthesize\s+\w+/, points: 1, comment: "Synthesize statement"},
                {pattern: /@dynamic\s+\w+/, points: 1, comment: "Dynamic statement"},

                // Objective-C Syntax and Constructions
                {pattern: /\[\w+\s+\w+.*]/, points: 2, comment: "Square bracket syntax"},
                {pattern: /NS\w+/, points: 1, comment: "Foundation framework class"},
                {pattern: /@selector\(\w+\)/, points: 1, comment: "Selector"},
                {pattern: /<\w+>/, points: 1, comment: "Protocol conformance"},
                {pattern: /@end/, points: 1, comment: "End of interface/implementation"},
                {pattern: /__weak\s+\w+\s*\*\w+/, points: 2, comment: "Weak reference"},
                {pattern: /__strong\s+\w+\s*\*\w+/, points: 2, comment: "Strong reference"},
                {pattern: /__block\s+\w+\s*\*\w+/, points: 2, comment: "Block variable"},
                {pattern: /\^\s*\(\w+\s*\*\)\s*\{/, points: 2, comment: "Block syntax"},
                {pattern: /@class\s+\w+/, points: 2, comment: "Forward class declaration"},
                {pattern: /@compatibility_alias\s+\w+\s+\w+/, points: 2, comment: "Compatibility alias"},

                // Exception Handling
                {pattern: /@throw\s*\w*/, points: 2, comment: "Throw exception"},
                {pattern: /@catch\s*\(/, points: 2, comment: "Catch block"},
                {pattern: /@finally\s*{/, points: 2, comment: "Finally block"},
                {pattern: /@try\s*{/, points: 2, comment: "Try block"},

                // Memory Management
                {pattern: /@autoreleasepool\s*{/, points: 2, comment: "Autorelease pool"},

                // Protocol Methods
                {pattern: /@optional/, points: 1, comment: "Optional protocol methods"},
                {pattern: /@required/, points: 1, comment: "Required protocol methods"},

                // Other Objective-C Specific Keywords and Syntax
                {pattern: /@encode\s*\(\w+\)/, points: 2, comment: "Encode"},

            ],

            'kotlin': [
                // Function and Class Declarations
                {pattern: /fun\s+\w+\(.*\)(\s*:\s*\w+)?\s*{/, points: 2, comment: "Function declaration"},
                {pattern: /class\s+\w+(\s*:\s*\w+\(\))?\s*{/, points: 2, comment: "Class declaration"},
                {pattern: /data\s+class\s+\w+\(.*\)/, points: 2, comment: "Data class"},
                {pattern: /object\s+\w+\s*{/, points: 2, comment: "Object declaration"},
                {pattern: /interface\s+\w+\s*{/, points: 2, comment: "Interface declaration"},
                {pattern: /sealed\s+class\s+\w+/, points: 2, comment: "Sealed class"},
                {pattern: /enum\s+class\s+\w+/, points: 2, comment: "Enum class"},

                // Variable Declarations
                {pattern: /val\s+\w+\s*:\s*\w+\s*=/, points: 2, comment: "Immutable variable declaration"},
                {pattern: /var\s+\w+\s*:\s*\w+\s*=/, points: 2, comment: "Mutable variable declaration"},

                // Functions and Coroutines
                {pattern: /fun\s+\w+\.\w+\(.*\)\s*{/, points: 2, comment: "Extension function"},
                {pattern: /suspend\s+fun\s+\w+/, points: 2, comment: "Suspend function for coroutines"},
                {pattern: /inline\s+fun\s+<\w+>\s+\w+\(.*\)\s*{/, points: 2, comment: "Inline function"},
                {
                    pattern: /reified\s+inline\s+fun\s+<\w+>\s+\w+\(.*\)\s*{/,
                    points: 2,
                    comment: "Reified type parameter in inline function"
                },
                {pattern: /infix\s+fun\s+\w+\.\w+\(.*\)\s*:/, points: 2, comment: "Infix function"},
                {pattern: /operator\s+fun\s+\w+\.\w+\(.*\)\s*:/, points: 2, comment: "Operator overloading"},
                {pattern: /vararg\s+\w+/, points: 2, comment: "Vararg parameter"},

                // Companion Object, Property, and Lazy Initialization
                {pattern: /companion\s+object\s*{/, points: 2, comment: "Companion object"},
                {pattern: /@property\s*\(.*\)\s*\w+\s*\*\w+;/, points: 2, comment: "Property declaration"},
                {pattern: /lazy\s*\(/, points: 2, comment: "Lazy initialization"},

                // Control Structures and Expressions
                {pattern: /when\s*\(/, points: 2, comment: "When expression"},
                {pattern: /lateinit\s+var\s+\w+:\s*\w+/, points: 2, comment: "Late-initialized property"},

                // Coroutines and Flow
                {pattern: /coroutineScope\s*{/, points: 2, comment: "Coroutine scope"},
                {pattern: /launch\s*\(/, points: 2, comment: "Launch a coroutine"},
                {pattern: /async\s*\(/, points: 2, comment: "Async coroutine builder"},
                {pattern: /flow\s*{/, points: 2, comment: "Flow builder for reactive streams"},
                {pattern: /suspendCancellableCoroutine\s*{/, points: 2, comment: "Suspend cancellable coroutine"},
                {pattern: /withContext\s*\(/, points: 2, comment: "Coroutine context switch"},

                // Annotations and Serialization
                {
                    pattern: /@JvmStatic/,
                    points: 2,
                    comment: "Annotation for companion object method to generate static method in Java"
                },
                {pattern: /@JvmOverloads/, points: 2, comment: "Annotation to generate overloads in Java"},
                {pattern: /@JvmField/, points: 2, comment: "Annotation to expose a field to Java"},
                {
                    pattern: /@JvmName\(.+\)/,
                    points: 2,
                    comment: "Annotation to specify the Java name of a Kotlin element"
                },
                {pattern: /@Serializable/, points: 2, comment: "Serialization annotation"},

                // Miscellaneous Kotlin Features
                {pattern: /println\(/, points: 1, comment: "Println function"},
                {pattern: /delegate\s*\(/, points: 2, comment: "Delegation"},
                {pattern: /by\s+lazy\s*{/, points: 2, comment: "Lazy delegation"},

            ],


            'scala': [
                // Object, Class, and Trait Declarations
                {pattern: /object\s+\w+\s*{/, points: 2, comment: "Object declaration"},
                {pattern: /class\s+\w+(\(.*\))?(\s+extends\s+\w+)?\s*{/, points: 2, comment: "Class declaration"},
                {pattern: /trait\s+\w+\s*{/, points: 2, comment: "Trait declaration"},
                {pattern: /abstract\s+class\s+\w+/, points: 2, comment: "Abstract class"},
                {pattern: /case\s+class\s+\w+\(.*\)/, points: 2, comment: "Case class"},
                {pattern: /case\s+object\s+\w+/, points: 2, comment: "Case object"},
                {pattern: /sealed\s+trait\s+\w+/, points: 2, comment: "Sealed trait"},

                // Method and Value Definitions
                {pattern: /def\s+\w+\(.*\)\s*:\s*\w+\s*=/, points: 2, comment: "Method definition"},
                {pattern: /val\s+\w+\s*:\s*\w+\s*=/, points: 2, comment: "Immutable value declaration"},
                {pattern: /var\s+\w+\s*:\s*\w+\s*=\s*\w+/, points: 2, comment: "Mutable variable"},
                {pattern: /def\s+apply\(\):\s*\w+/, points: 2, comment: "Apply method"},
                {pattern: /def\s+unapply\(.*\): Option\[/, points: 2, comment: "Unapply method for extractors"},
                {pattern: /implicit\s+val\s+\w+\s*:\s*\w+/, points: 2, comment: "Implicit value"},
                {pattern: /implicit\s+def\s+\w+\(.*\):/, points: 2, comment: "Implicit method"},

                // Pattern Matching and Comprehensions
                {pattern: /\w+\s+match\s*{/, points: 2, comment: "Pattern matching"},
                {pattern: /for\s*\(\w+\s+<-/, points: 2, comment: "For-comprehension"},
                {pattern: /yield\s*\w+/, points: 2, comment: "Yield in for-comprehension"},

                // Lazy and Type Declarations
                {pattern: /lazy\s+val\s+\w+\s*:\s*\w+/, points: 2, comment: "Lazy value"},
                {pattern: /type\s+\w+\s*=\s*\w+/, points: 2, comment: "Type alias"},

                // Annotations and Imports
                {pattern: /@tailrec/, points: 2, comment: "Tail recursion annotation"},
                {pattern: /import\s+scala\.\w+/, points: 2, comment: "Importing Scala library"},

                // Scala Collections and Types
                {pattern: /Option\[/, points: 2, comment: "Option type"},
                {pattern: /List\[/, points: 2, comment: "List type"},
                {pattern: /Vector\[/, points: 2, comment: "Vector type"},
                {pattern: /Seq\[/, points: 2, comment: "Seq type"},
                {pattern: /Map\[/, points: 2, comment: "Map type"},
                {pattern: /Set\[/, points: 2, comment: "Set type"},
                {pattern: /Future\[/, points: 2, comment: "Future type"},
                {pattern: /Either\[/, points: 2, comment: "Either type"},
                {pattern: /Tuple\d+\[/, points: 2, comment: "Tuple types"},

            ],


            'perl': [
                // Variable Types
                {pattern: /\$\w+/, points: 2, comment: "Scalar Variables"},
                {pattern: /@\w+/, points: 2, comment: "Array Variables"},
                {pattern: /%\w+/, points: 2, comment: "Hash Variables"},

                // Subroutine Declarations and Control Structures
                {pattern: /sub\s+\w+\s*{/, points: 2, comment: "Subroutine Declarations"},
                {pattern: /foreach\s+\$\w+\s+\(/, points: 2, comment: "Foreach loop"},
                {pattern: /if\s*\(.*\)\s*{/, points: 2, comment: "If statement"},
                {pattern: /while\s*\(.*\)\s*{/, points: 2, comment: "While loop"},
                {pattern: /unless\s*\(.*\)\s*{/, points: 2, comment: "Unless statement"},
                {pattern: /for\s*\(.*;.*;.*\)\s*{/, points: 2, comment: "For loop"},

                // Regular Expressions and String Manipulations
                {pattern: /m\/.*\/[gim]?/, points: 2, comment: "Regular Expressions"},
                {pattern: /s\/.*\/.*\/[gim]?/, points: 2, comment: "Substitution"},
                {pattern: /tr\/.*\/.*\/d?/, points: 2, comment: "Transliteration"},

                // File Handling
                {pattern: /open\s+\w+,\s*".+",\s*\$\w+/, points: 2, comment: "File open"},
                {pattern: /close\s+\$\w+/, points: 2, comment: "File close"},
                {pattern: /<>\s*;?/, points: 2, comment: "File read shorthand"},

                // Array and Hash Operations
                {pattern: /push\s*@\w+,\s*\$\w+/, points: 2, comment: "Array push"},
                {pattern: /pop\s*@\w+/, points: 2, comment: "Array pop"},
                {pattern: /shift\s*@\w+/, points: 2, comment: "Array shift"},
                {pattern: /unshift\s*@\w+,\s*\$\w+/, points: 2, comment: "Array unshift"},
                {pattern: /keys\s*%\w+/, points: 2, comment: "Keys of a hash"},
                {pattern: /values\s*%\w+/, points: 2, comment: "Values of a hash"},

                // Function and Statement Use
                {pattern: /use\s+\w+;/, points: 2, comment: "Use statement"},
                {pattern: /require\s+\w+;/, points: 2, comment: "Require statement"},
                {pattern: /map\s*{\s*.*\s*}\s*@\w+/, points: 2, comment: "Map function"},
                {pattern: /grep\s*{\s*.*\s*}\s*@\w+/, points: 2, comment: "Grep function"},
                {pattern: /print\s*".*"/, points: 1, comment: "Print statement"},
                {pattern: /say\s*".*"/, points: 2, comment: "Say function (Perl 5.10+)"},

                // Variable Declaration, Scoping, and Keywords
                {pattern: /my\s+\$\w+/, points: 2, comment: "Variable declaration with 'my'"},
                {pattern: /our\s+\$\w+/, points: 2, comment: "Variable declaration with 'our'"},
                {pattern: /local\s+\$\w+/, points: 2, comment: "Local scoping with 'local'"},
                {pattern: /last\s*;?/, points: 2, comment: "'last' keyword"},
                {pattern: /next\s*;?/, points: 2, comment: "'next' keyword"},
                {pattern: /redo\s*;?/, points: 2, comment: "'redo' keyword"},
                {pattern: /goto\s*\w+/, points: 2, comment: "'goto' statement"},

                // Object-Oriented Perl
                {pattern: /bless\s+\$\w+,\s*"\w+"/, points: 2, comment: "Bless for OOP"},
                {pattern: /package\s+\w+;/, points: 2, comment: "Package declaration"},

            ],


            'bash': [
                // Shebang and Basic Commands
                {pattern: /#!\/bin\/bash/, points: 2, comment: "Shebang"},
                {pattern: /echo\s+-e\s+".*"/, points: 1, comment: "Echo Command"},
                {pattern: /read\s+\w+/, points: 2, comment: "Read command"},
                {pattern: /exit\s+\d+/, points: 2, comment: "Exit command"},

                // Variable Operations
                {pattern: /\w+=\w+/, points: 2, comment: "Variable Assignment"},
                {pattern: /\$\w+/, points: 2, comment: "Variable usage"},
                {pattern: /export\s+\w+=/, points: 2, comment: "Export command"},

                // Function Declaration
                {pattern: /function\s+\w+\s*{/, points: 2, comment: "Function Declaration"},

                // Control Structures
                {pattern: /if\s+\[.*];\s+then/, points: 2, comment: "Conditional Statements"},
                {pattern: /(for|while)\s+\w+\s+in\s+\w+;/, points: 2, comment: "Loops"},
                {pattern: /case\s+\w+\s+in/, points: 2, comment: "Case statement"},

                // Command Substitution
                {pattern: /\$\(\w+\)/, points: 2, comment: "Command substitution"},

                // File and Process Handling
                {pattern: /trap\s+'.+'\s+\w+/, points: 2, comment: "Trap command"},
                {pattern: /grep\s+.+/, points: 2, comment: "Grep command"},
                {pattern: /sed\s+'.+'/, points: 2, comment: "Sed command"},
                {pattern: /awk\s+'.+'/, points: 2, comment: "Awk command"},
                {pattern: /cut\s+-d\s+'.+'/, points: 2, comment: "Cut command"},
                {pattern: /sort\s+/, points: 2, comment: "Sort command"},
                {pattern: /uniq\s+/, points: 2, comment: "Uniq command"},

                // Networking
                {pattern: /curl\s+/, points: 2, comment: "Curl command"},
                {pattern: /wget\s+/, points: 2, comment: "Wget command"},

                // Additional Bash Patterns
                {pattern: /test\s+.+/, points: 2, comment: "Test command"},
                {pattern: /\[\[.*]]/, points: 2, comment: "Advanced test/conditional"},
                {pattern: /\$\{\w+}/, points: 2, comment: "Variable expansion"},
                {pattern: /source\s+\w+/, points: 2, comment: "Source command"},
                {pattern: /alias\s+\w+='.*'/, points: 2, comment: "Alias definition"},
                {pattern: /select\s+\w+\s+in/, points: 2, comment: "Select loop"},
                {pattern: /shift/, points: 2, comment: "Shift command (for shifting positional parameters)"},
                {
                    pattern: /getopts\s+'.+'\s+\w+/,
                    points: 2,
                    comment: "Getopts command (for parsing command line options)"
                },
                {pattern: /set\s+-e/, points: 2, comment: "Set command with -e (for automatically exiting on error)"},
                {pattern: /[[\w-]+=~.+/, points: 2, comment: "Regex matching within [[ ]]"},

            ],


            'r': [
                // Function Definition and Variable Assignment
                {pattern: /\w+\s*<-\s*function\(\s*\)/, points: 2, comment: "Function Definition"},
                {pattern: /\w+\s*<-\s*\w+/, points: 2, comment: "Variable Assignment"},

                // Library Imports and Common R Functions
                {pattern: /(library|require)\(\w+\)/, points: 2, comment: "Library or Require"},
                {pattern: /ggplot\(/, points: 2, comment: "ggplot"},
                {pattern: /lm\(.+\)/, points: 2, comment: "Linear Model"},
                {pattern: /plot\(.+\)/, points: 2, comment: "Plot function"},
                {pattern: /summary\(.+\)/, points: 2, comment: "Summary function"},
                {pattern: /str\(.+\)/, points: 2, comment: "Structure function"},

                // Data Manipulation and Analysis
                {pattern: /data.frame\(/, points: 2, comment: "Data Frame"},
                {pattern: /apply\(.+\)/, points: 2, comment: "Apply function"},
                {pattern: /lapply\(.+\)/, points: 2, comment: "List Apply function"},
                {pattern: /sapply\(.+\)/, points: 2, comment: "Simplified Apply function"},
                {pattern: /tapply\(.+\)/, points: 2, comment: "Table Apply function"},
                {pattern: /aggregate\(.+\)/, points: 2, comment: "Aggregate function"},
                {pattern: /merge\(.+\)/, points: 2, comment: "Merge function"},
                {pattern: /table\(.+\)/, points: 2, comment: "Table function"},
                {pattern: /ifelse\(.+\)/, points: 2, comment: "ifelse function"},

                // Comments and Operators
                {pattern: /#.*$/, points: 1, comment: "Comments"},
                {pattern: /<-/, points: 2, comment: "Assignment operator"},

                // Indexing and Data Selection
                {pattern: /\w+\[\w+]/, points: 2, comment: "Array indexing"},

                // Other R-specific Features
                {pattern: /matrix\(.+\)/, points: 2, comment: "Matrix function"},
                {pattern: /factor\(.+\)/, points: 2, comment: "Factor function"},
                {pattern: /levels\(.+\)/, points: 2, comment: "Levels function"},
                {pattern: /na.omit\(.+\)/, points: 2, comment: "NA handling"},
                {pattern: /seq\(.+\)/, points: 2, comment: "Sequence generation"},
                {pattern: /rep\(.+\)/, points: 2, comment: "Repeating elements"},
                {pattern: /list\(.+\)/, points: 2, comment: "List creation"},
                {pattern: /subset\(.+\)/, points: 2, comment: "Data subsetting"},
                {pattern: /as\.\w+\(.+\)/, points: 2, comment: "Type conversion"},
                {pattern: /dim\(.+\)/, points: 2, comment: "Dimensions of an object"},
                {pattern: /row.names\(.+\)/, points: 2, comment: "Row names"},

            ],

            'noncode': [
                {pattern: /^[a-zA-Z0-9\s,.'’“”"?!;:()-]+$/, points: 1, comment: "Continuous text without code syntax"},
                {
                    pattern: /^(?!.*[{<>\/\\*}#;=\[\]]).+$/,
                    points: 1,
                    comment: "Lines not starting with common code symbols"
                },
                {pattern: /[A-Z][a-z]+ [a-z]+/, points: 1, comment: "Sentence-like structures"},
                {
                    pattern: /\b(and|or|but|if|when|while|therefore|however|because|through|although|despite|unless|whereas)\b/,
                    points: 1,
                    comment: "Common English connectors and prepositions"
                },
                {
                    pattern: /\b(at the end of the day|so to speak|in a nutshell|a piece of cake|once in a blue moon|better late than never)\b/,
                    points: 1,
                    comment: "Common phrases or idioms"
                },
                {
                    pattern: /(\bwhat\b|\bhow\b|\bwhy\b|\bwhere\b|\bwho\b|\bwhen\b)\s+[a-zA-Z]+/,
                    points: 1,
                    comment: "Question patterns"
                },
                {
                    pattern: /(\bdear\b|\bhello\b|\bhi\b|\bhey\b|\bexcuse me\b|\bthank you\b|\bthanks\b)/,
                    points: 1,
                    comment: "Direct address or dialogue"
                },

                // Code comment patterns
                {pattern: /^(\/\/.*)/, points: -3, comment: "Single line comment"},
                {pattern: /^(\/\*[\s\S]*?\*\/)/, points: -3, comment: "Multi-line comment"},
                {pattern: /^(#.*$)/, points: -3, comment: "Hash-prefixed comment"},
                {pattern: /(\s#.*$)/, points: -3, comment: "Hash-prefixed comment after whitespace"},
                {pattern: /^(--.*)/, points: -3, comment: "SQL-style comment"},
                {pattern: /^(\t+|\s{2,})/, points: -3, comment: "Line starts with indentation"}
            ],

            'Unknown': [],
        };
        this.confidenceMargin = 5;  // Margin to ensure language detection confidence
        this.codeThreshold = 3;
        this.lastDetectedLanguage = 'Unknown'; // Initialize with 'Unknown'
        this.languageDistributions = [];
        window.DetectLang = this;
    }


    // Helper function to calculate points for a line of code
    getPoints(language, lineOfCode, checkers) {
        let points = 0;
        checkers.forEach(checker => {
            if (checker.pattern.test(lineOfCode)) {
                points += checker.points;
            }
        });
        return points;
    }
    async quickDetect(snippet) {
        let linesOfCode = snippet.split('\n');
        let cumulativeScores = {};
        let maxPointsPerLine = 5; // Example value, adjust as needed
        let maxPossibleScore = linesOfCode.length * maxPointsPerLine;

        for (const line of linesOfCode) {
            for (const language of Object.keys(this.languages)) {
                const points = this.getPoints(language, line, this.languages[language]);

                if (!cumulativeScores[language]) {
                    cumulativeScores[language] = 0;
                }
                cumulativeScores[language] += points;
            }
        }

        let languageDistributions = Object.entries(cumulativeScores)
            .filter(([_, score]) => score > 0)
            .map(([language, score]) => {
                return {
                    language,
                    score,
                    confidence: (score / maxPossibleScore) * 100
                };
            })
            .sort((a, b) => b.score - a.score);

        // Store the top language distributions
        this.languageDistributions = languageDistributions;

        return languageDistributions; // Return the full distribution
    }



// Main function to detect the language of a code snippet
    async detect(snippet, options) {
        const opts = _.defaults(options || {}, {
            heuristic: true,
            statistics: true,
        });

        let linesOfCode = snippet.replace(/\r\n?/g, '\n').replace(/\n{2,}/g, '\n').split('\n');
        const nearTop = index => linesOfCode.length <= 10 || index < linesOfCode.length / 10;

        if (opts.heuristic && linesOfCode.length > 500) {
            linesOfCode = linesOfCode.filter((line, index) => nearTop(index) || index % Math.ceil(linesOfCode.length / 500) === 0);
        }

        let combinedSnippet = linesOfCode.join('\n');
        const pairs = _.keys(this.languages).map(key => ({language: key, checkers: this.languages[key]}));
        let stats = [];
        let combinedResults;
        let lineResults;
        let cumulativeScores = {};
        let confidenceScores = {};
        let maxPossibleScore = linesOfCode.length * this.codeThreshold;

        try {
            combinedResults = await Promise.all(pairs.map(async ({language, checkers}) => {
                let totalPoints = await this.calculateTotalPoints(language, [combinedSnippet], checkers, () => false);

                cumulativeScores[language] = totalPoints;
                confidenceScores[language] = (cumulativeScores[language] / maxPossibleScore) * 100;

                return {language, totalPoints};
            }));

            lineResults = await Promise.all(pairs.map(async ({language, checkers}) => {
                const totalPoints = await this.calculateTotalPoints(language, linesOfCode, checkers, nearTop);
                return {language, totalPoints};
            }));

            let finalResults = combinedResults.map((result, index) => {
                return {
                    language: result.language,
                    totalPoints: result.totalPoints + lineResults[index].totalPoints
                };
            });

            finalResults.sort((a, b) => b.totalPoints - a.totalPoints);

            let topResult = finalResults[0];
            let topLanguage = topResult.language;
            let topConfidence = confidenceScores[topLanguage];

            // Get initial top language and its confidence
            let initialTopLanguage = this.languageDistributions[0].language;
            let initialTopConfidence = this.languageDistributions[0].confidence;

            // Check if the new top language should be considered
            if (topConfidence >= initialTopConfidence + this.confidenceMargin || (topLanguage === initialTopLanguage && topConfidence > 0)) {
                this.lastDetectedLanguage = topLanguage;
            } else {
                this.lastDetectedLanguage = initialTopLanguage;
            }

            if (opts.statistics) {
                linesOfCode.forEach((line, index) => {
                    let lineStats = pairs.map(({language, checkers}) => {
                        const points = this.getPoints(language, line, checkers);
                        return {language, points};
                    });
                    let isCode = lineStats.some(stat => stat.points > this.codeThreshold);
                    stats.push({line, index, isCode, lineStats});
                });
            }

            return opts.statistics ? {language: this.lastDetectedLanguage, stats} : this.lastDetectedLanguage;

        } catch (error) {
            console.error(error);
            return opts.statistics ? {language: 'Unknown', error: error.message, stats} : 'Unknown';
        }
    }





// Helper function to calculate total points for a language
    async calculateTotalPoints(language, linesOfCode, checkers, nearTop) {
        const pointsPromises = linesOfCode.map((line, index) => {
            const relevantCheckers = nearTop(index) ? checkers : _.reject(checkers, checker => checker.nearTop);
            return this.getPoints(language, line, relevantCheckers);
        });

        const pointsList = await Promise.all(pointsPromises);
        return pointsList.reduce((sum, points) => sum + points, 0);
    }

// Function to split a code snippet into chunks based on language detection
    async splitIntoLanguageChunks(snippet) {
        // Reset any stored state or biases
        this.resetDetectionState();

        return await this.adaptiveDetect(snippet);
    }

// Helper method to reset detection state
    resetDetectionState() {
        this.lastDetectedLanguage = 'Unknown';
        this.languageDistributions = [];
    }


// Adaptive detection function to process code snippet in chunks


    async adaptiveDetect(snippet) {
        const defaultChunkSize = 8;
        
        console.log("Starting language detection...");
        // Try to establish initial language distributions with the first 10 lines
        let initialDistributions = await this.attemptToFindInitialBias(snippet, defaultChunkSize * 2, 0);

        if (initialDistributions.length === 0) {
            // If no distributions found, try again with 20 lines from a random position
            let randomStart = Math.floor(Math.random() * defaultChunkSize);
            initialDistributions = await this.attemptToFindInitialBias(snippet, defaultChunkSize * 4, randomStart);
        }

       // console.log("Initial language distributions:");
        initialDistributions.forEach(dist => {
           // console.log(`${dist.language}: Confidence score of ${dist.confidence}`);
        });


       
        let blocks = this.extractCodeBlocks(snippet);
        let detectionTasks = [];

        // Create tasks for processing both code and non-code blocks
        for (let block of blocks) {
            if (block.isCode) {
                // Directly process code blocks
                detectionTasks.push(this.processBlock(block.text, true));
            } else {
                // Split non-code text into chunks and process each
                let lines = block.text.split('\n');
                for (let i = 0; i < lines.length; i += defaultChunkSize) {
                    let end = Math.min(i + defaultChunkSize, lines.length);
                    let chunkText = lines.slice(i, end).join('\n');
                    detectionTasks.push(this.processBlock(chunkText, false));
                }
            }
        }

        // Await all detection tasks and process results
        let processedResults = await Promise.all(detectionTasks);
        let combinedChunks = this.reassembleChunks(processedResults, blocks);

        console.log("End combinedChunks detection result");
        combinedChunks.forEach((chunk, index) => {
            console.log(`Combined chunk ${index + 1}: Language - ${chunk.language}`);
            console.log(`Text: ${chunk.lines.join('\n')}`);
            console.log('---');
        });

        return combinedChunks;
    }

    async attemptToFindInitialBias(snippet, lineCount, startLine) {
        let lines = snippet.split('\n').slice(startLine, startLine + lineCount);
        let testSnippet = lines.join('\n');
        return await this.quickDetect(testSnippet);
    }


    async processBlock(text, isCode) {
        let detectionResult = await this.detect(text, {heuristic: true, statistics: true});
        let lines = text.split('\n');
        let combinedText = lines.join('\n');
        return {language: detectionResult.language, lines: lines, text: combinedText, isCode};
    }


    reassembleChunks(processedResults, originalBlocks) {
        let combinedChunks = [];
        let resultIndex = 0;

        for (let block of originalBlocks) {
            if (block.isCode) {
                // Add processed code block
                combinedChunks.push(processedResults[resultIndex++]);
            } else {
                // Collect all contiguous non-code chunks for this block
                let nonCodeChunks = [];
                while (resultIndex < processedResults.length && !processedResults[resultIndex].isCode) {
                    nonCodeChunks.push(processedResults[resultIndex]);
                    resultIndex++;
                }

                // Group non-code chunks by detected language, including 'noncode' as a category
                let chunksByLanguage = this.groupChunksByLanguage(nonCodeChunks);

                // Handle 'noncode' chunks separately
                if (chunksByLanguage['noncode']) {
                    combinedChunks.push(...chunksByLanguage['noncode']);
                    delete chunksByLanguage['noncode']; // Remove 'noncode' from further processing
                }

                // Handle 'Unknown' language chunks by appending them to the last block
                if (chunksByLanguage['Unknown'] && combinedChunks.length > 0) {
                    combinedChunks[combinedChunks.length - 1].lines.push(...chunksByLanguage['Unknown'].flatMap(chunk => chunk.lines));
                    delete chunksByLanguage['Unknown']; // Remove 'Unknown' from further processing
                }

                // Combine remaining chunks of the same language
                Object.keys(chunksByLanguage).forEach(language => {
                    let combined = this.combineChunks(chunksByLanguage[language]);
                    combinedChunks.push(...combined); // Add combined chunks
                });
            }
        }

        return combinedChunks;
    }


    groupChunksByLanguage(chunks) {
        let chunksByLanguage = {};

        for (let chunk of chunks) {
            let language = chunk.language || 'Unknown';
            if (!chunksByLanguage[language]) {
                chunksByLanguage[language] = [];
            }
            chunksByLanguage[language].push(chunk);
        }

        return chunksByLanguage;
    }


    extractCodeBlocks(text) {
        const codeBlockRegex = /```([^`]+)```/g;
        let match;
        let blocks = [];
        let lastIndex = 0;

        while ((match = codeBlockRegex.exec(text)) !== null) {
            let start = match.index;
            let end = codeBlockRegex.lastIndex;
            // Save non-code text
            if (lastIndex < start) {
                blocks.push({isCode: false, text: text.substring(lastIndex, start)});
            }
            // Save code block
            blocks.push({isCode: true, text: match[1].trim(), start, end});
            lastIndex = end;
        }
        // Remaining text after last code block
        if (lastIndex < text.length) {
            blocks.push({isCode: false, text: text.substring(lastIndex)});
        }

        return blocks;
    }


// Method to combine consecutive chunks of the same language
    combineChunks(chunks) {
        let combinedChunks = [];
        let currentChunk = null;

        chunks.forEach(chunk => {
            if (currentChunk && chunk.language === currentChunk.language) {
                // Combine lines without altering the original chunk's lines array
                currentChunk.lines = currentChunk.lines.concat(chunk.lines);
                // Regenerate text from combined lines to ensure it matches the updated lines array
                currentChunk.text = currentChunk.lines.join('\n');
            } else {
                if (currentChunk) {
                    combinedChunks.push(currentChunk);
                }
                // Create a deep copy of the chunk to avoid modifying the original chunk
                // and ensure text matches the lines array
                currentChunk = {
                    ...chunk,
                    lines: [...chunk.lines],
                    text: chunk.lines.join('\n') // Ensure text is generated from lines for new chunk
                };
            }
        });

        if (currentChunk) {
            combinedChunks.push(currentChunk);
        }

        return combinedChunks;
    }




}



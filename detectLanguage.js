
class DetectLanguage {
    constructor() {
        this.languages = {
            'JavaScript': [
                // undefined keyword
                {pattern: /undefined/g, points: 2},
                // console.log('ayy lmao')
                {pattern: /console\.log( )*\(/, points: 2},
                // Variable declaration
                {pattern: /(var|const|let)( )+\w+( )*=?/, points: 2},
                // Array/Object declaration
                {pattern: /((['"]).+(['"])( )*|\w+):( )*[{\[]/, points: 2},
                // === operator
                {pattern: /===/g, points: 1},
                // !== operator
                {pattern: /!==/g, points: 1},
                // Function definition
                {pattern: /function\*?(( )+[$\w]+( )*\(.*\)|( )*\(.*\))/g, points: 1},
                // null keyword
                {pattern: /null/g, points: 1},
                // lambda expression
                {pattern: /\(.*\)( )*=>( )*.+/, points: 1},
                // (else )if statement
                {pattern: /(else )?if( )+\(.+\)/, points: 1},
                // while loop
                {pattern: /while( )+\(.+\)/, points: 1},
                // C style variable declaration.
                {pattern: /(^|\s)(char|long|int|float|double)( )+\w+( )*=?/, points: -1},
                // pointer
                {pattern: /(\w+)( )*\*( )*\w+/, points: -1},
                // HTML <script> tag
                {pattern: /<(\/)?script( type=(['"])text\/javascript(['"]))?>/, points: -50},
            ],

            'C': [
                // Primitive variable declaration.
                {pattern: /(char|long|int|float|double)( )+\w+( )*=?/, points: 2},
                // malloc function call
                {pattern: /malloc\(.+\)/, points: 2},
                // #include <whatever.h>
                {pattern: /#include ([<"])\w+\.h([>"])/, points: 2, nearTop: true},
                // pointer
                {pattern: /(\w+)( )*\*( )*\w+/, points: 2},
                // Variable declaration and/or initialisation.
                {pattern: /(\w+)( )+\w+(;|( )*=)/, points: 1},
                // Array declaration.
                {pattern: /(\w+)( )+\w+\[.+]/, points: 1},
                // #define macro
                {pattern: /#define( )+.+/, points: 1},
                // NULL constant
                {pattern: /NULL/, points: 1},
                // void keyword
                {pattern: /void/g, points: 1},
                // (else )if statement
                {pattern: /(else )?if( )*\(.+\)/, points: 1},
                // while loop
                {pattern: /while( )+\(.+\)/, points: 1},
                // printf function
                {pattern: /(printf|puts)( )*\(.+\)/, points: 1},
                // new Keyword from C++
                {pattern: /new \w+/, points: -1},
                // new Keyword from Java
                {pattern: /new [A-Z]\w*( )*\(.+\)/, points: 2},
                // Single quote multicharacter string
                {pattern: /'.{2,}'/, points: -1},
                // JS variable declaration
                {pattern: /var( )+\w+( )*=?/, points: -1},
            ],

            'C++': [
                // Primitive variable declaration.
                {pattern: /(char|long|int|float|double)( )+\w+( )*=?/, points: 2},
                // #include <whatever.h>
                {pattern: /#include( )*([<"])\w+(\.h)?([>"])/, points: 2, nearTop: true},
                // using namespace something
                {pattern: /using( )+namespace( )+.+( )*;/, points: 2},
                // template declaration
                {pattern: /template( )*<.*>/, points: 2},
                // std
                {pattern: /std::\w+/g, points: 2},
                // cout/cin/endl
                {pattern: /(cout|cin|endl)/g, points: 2},
                // Visibility specifiers
                {pattern: /(public|protected|private):/, points: 2},
                // nullptr
                {pattern: /nullptr/, points: 2},
                // new Keyword
                {pattern: /new \w+(\(.*\))?/, points: 1},
                // #define macro
                {pattern: /#define( )+.+/, points: 1},
                // template usage
                {pattern: /\w+<\w+>/, points: 1},
                // class keyword
                {pattern: /class( )+\w+/, points: 1},
                // void keyword
                {pattern: /void/g, points: 1},
                // (else )if statement
                {pattern: /(else )?if( )*\(.+\)/, points: 1},
                // while loop
                {pattern: /while( )+\(.+\)/, points: 1},
                // Scope operator
                {pattern: /\w*::\w+/, points: 1},
                // Single quote multicharacter string
                {pattern: /'.{2,}'/, points: -1},
                // Java List/ArrayList
                {pattern: /(List<\w+>|ArrayList<\w*>( )*\(.*\))(( )+\w+|;)/, points: -1},
            ],

            'Python': [
                // Function definition
                {pattern: /def( )+\w+\(.*\)( )*:/, points: 2},
                // while loop
                {pattern: /while (.+):/, points: 2},
                // from library import something
                {pattern: /from [\w.]+ import (\w+|\*)/, points: 2},
                // class keyword
                {pattern: /class( )*\w+(\(( )*\w+( )*\))?( )*:/, points: 2},
                // if keyword
                {pattern: /if( )+(.+)( )*:/, points: 2},
                // elif keyword
                {pattern: /elif( )+(.+)( )*:/, points: 2},
                // else keyword
                {pattern: /else:/, points: 2},
                // for loop
                {pattern: /for (\w+|\(?\w+,( )*\w+\)?) in (.+):/, points: 2},
                // Python variable declaration.
                {pattern: /\w+( )*=( )*\w+(?!;)(\n|$)/, points: 1},
                // import something
                {pattern: /import ([[^.]\w])+/, points: 1, nearTop: true},
                // print statement/function
                {pattern: /print((( )*\(.+\))|( )+.+)/, points: 1},
                // &&/|| operators
                {pattern: /(&{2}|\|{2})/, points: -1},
            ],

            'Java': [
                // System.out.println() etc.
                {pattern: /System\.(in|out)\.\w+/, points: 2},
                // Class variable declarations
                {pattern: /(private|protected|public)( )*\w+( )*\w+(( )*=( )*\w)?/, points: 2},
                // Method
                {pattern: /(private|protected|public)( )*\w+( )*\w+\(.+\)/, points: 2},
                // String class
                {pattern: /(^|\s)(String)( )+\w+( )*=?/, points: 2},
                // List/ArrayList
                {pattern: /(List<\w+>|ArrayList<\w*>( )*\(.*\))(( )+\w+|;)/, points: 2},
                // class keyword
                {pattern: /(public( )*)?class( )*\w+/, points: 2},
                // Array declaration.
                {pattern: /(\w+)(\[( )*])+( )+\w+/, points: 2},
                // final keyword
                {pattern: /final( )*\w+/, points: 2},
                // getter & setter
                {pattern: /\w+\.(get|set)\(.+\)/, points: 2},
                // new Keyword (Java)
                {pattern: /new [A-Z]\w*( )*\(.+\)/, points: 2},
                // C style variable declaration.
                {pattern: /(^|\s)(char|long|int|float|double)( )+\w+( )*=?/, points: 1},
                // extends/implements keywords
                {pattern: /(extends|implements)/, points: 2, nearTop: true},
                // null keyword
                {pattern: /null/g, points: 1},
                // (else )if statement
                {pattern: /(else )?if( )*\(.+\)/, points: 1},
                // while loop
                {pattern: /while( )+\(.+\)/, points: 1},
                // void keyword
                {pattern: /void/g, points: 1},
                // const
                {pattern: /const( )*\w+/, points: -1},
                // pointer
                {pattern: /(\w+)( )*\*( )*\w+/, points: -1},
                // Single quote multicharacter string
                {pattern: /'.{2,}'/, points: -1},
                // C style include
                {pattern: /#include( )*([<"])\w+(\.h)?([>"])/, points: -1, nearTop: true},
            ],

            'HTML': [
                {pattern: /<!DOCTYPE (html|HTML PUBLIC .+)>/, points: 2, nearTop: true},
                // Tags
                {pattern: /<[a-z0-9]+(( )*\w+=(['"]).+(['"])( )*)?>.*<\/[a-z0-9]+>/g, points: 2},
                // Properties
                {pattern: /[a-z\-]+=(["']).+(["'])/g, points: 2},
                // PHP tag
                {pattern: /<\?php/, points: -50},
            ],

            'CSS': [
                // Properties
                {pattern: /[a-z\-]+:(?!:).+;/, points: 2},
                // <style> tag from HTML
                {pattern: /<(\/)?style>/, points: -50},
            ],

            'Ruby': [
                // require/include
                {pattern: /(require|include)( )+'\w+(\.rb)?'/, points: 2, nearTop: true},
                // Function definition
                {pattern: /def( )+\w+( )*(\(.+\))?( )*\n/, points: 2},
                // Instance variables
                {pattern: /@\w+/, points: 2},
                // Boolean property
                {pattern: /\.\w+\?/, points: 2},
                // puts (Ruby print)
                {pattern: /puts( )+(["']).+(["'])/, points: 2},
                // Inheriting class
                {pattern: /class [A-Z]\w*( )*<( )*([A-Z]\w*(::)?)+/, points: 2},
                // attr_accessor
                {pattern: /attr_accessor( )+(:\w+(,( )*)?)+/, points: 2},
                // new
                {pattern: /\w+\.new( )+/, points: 2},
                // elsif keyword
                {pattern: /elsif/, points: 2},
                // do
                {pattern: /do( )*\|(\w+(,( )*\w+)?)+\|/, points: 2},
                // for loop
                {pattern: /for (\w+|\(?\w+,( )*\w+\)?) in (.+)/, points: 1},
                // nil keyword
                {pattern: /nil/, points: 1},
                // Scope operator
                {pattern: /[A-Z]\w*::[A-Z]\w*/, points: 1},
            ],

            'Go': [
                // package something
                {pattern: /package( )+[a-z]+\n/, points: 2, nearTop: true},
                // import
                {pattern: /(import( )*\(( )*\n)|(import( )+"[a-z0-9\/.]+")/, points: 2, nearTop: true},
                // error check
                {pattern: /if.+err( )*!=( )*nil.+{/, points: 2},
                // Go print
                {pattern: /fmt\.Print(f|ln)?\(.*\)/, points: 2},
                // function
                {pattern: /func(( )+\w+( )*)?\(.*\).*{/, points: 2},
                // variable initialisation
                {pattern: /\w+( )*:=( )*.+[^;\n]/, points: 2},
                // if/else if
                {pattern: /(}( )*else( )*)?if[^()]+{/, points: 2},
                // var/const declaration
                {pattern: /(var|const)( )+\w+( )+[\w*]+(\n|( )*=|$)/, points: 2},
                // public access on package
                {pattern: /[a-z]+\.[A-Z]\w*/, points: 1},
                // nil keyword
                {pattern: /nil/, points: 1},
                // Single quote multicharacter string
                {pattern: /'.{2,}'/, points: -1},
            ],

            'PHP': [
                // PHP tag
                {pattern: /<\?php/, points: 2},
                // PHP style variables.
                {pattern: /\$\w+/, points: 2},
                // use Something\Something;
                {pattern: /use( )+\w+(\\\w+)+( )*;/, points: 2, nearTop: true},
                // arrow
                {pattern: /\$\w+->\w+/, points: 2},
                // require/include
                {pattern: /(require|include)(_once)?( )*\(?( )*(['"]).+\.php(['"])( )*\)?( )*;/, points: 2},
                // echo 'something';
                {pattern: /echo( )+(['"]).+(['"])( )*;/, points: 1},
                // NULL constant
                {pattern: /NULL/, points: 1},
                // new keyword
                {pattern: /new( )+((\\\w+)+|\w+)(\(.*\))?/, points: 1},
                // Function definition
                {pattern: /function(( )+[$\w]+\(.*\)|( )*\(.*\))/g, points: 1},
                // (else)if statement
                {pattern: /(else)?if( )+\(.+\)/, points: 1},
                // scope operator
                {pattern: /\w+::\w+/, points: 1},
                // === operator
                {pattern: /===/g, points: 1},
                // !== operator
                {pattern: /!==/g, points: 1},
                // C/JS style variable declaration.
                {pattern: /(^|\s)(var|char|long|int|float|double)( )+\w+( )*=?/, points: -1},
            ],
            'C#': [
                // Namespace Declarations
                {pattern: /using\s+\w+(\.\w+)*;/, points: 2},
                // Class/Interface/Enum Declarations
                {pattern: /(public|private|protected|internal)\s+(class|interface|enum)\s+\w+/, points: 2},
                // Method Declarations
                {pattern: /(public|private|protected|internal)\s+\w+\s+\w+\(.*\)/, points: 2},
                // Properties
                {pattern: /(public|private|protected|internal)\s+\w+\s+\{\s+get;\s+set;\s+}/, points: 2},
                // C# Specific Keywords
                {pattern: /\b(var|async|await|yield|get|set|value)\b/, points: 2},
                // Attribute Usage
                {pattern: /\[\w+\(\)]/, points: 2},
                // LINQ Queries
                {pattern: /from\s+\w+\s+in\s+\w+\s+where\s+.*\s+select\s+.*/, points: 2},
                // String Interpolation
                {pattern: /\$@?".+"/, points: 2},
                // Lambda Expressions
                {pattern: /\w+ => \w+/, points: 2},
                // Generic Types
                {pattern: /\w+<\w+>/, points: 2},
                // Multiline Comments
                {pattern: /\/\*[\s\S]*?\*\//, points: 1},
                // Single Line Comments
                {pattern: /\/\/.+/, points: 1},
                // C# 'Console.WriteLine' statement
                {pattern: /Console\.Write(Line)?\(/, points: 2},
                // String Declaration
                {pattern: /string\s+\w+\s*=\s*".*";/, points: 2},
                // C# Main method
                {pattern: /static\s+void\s+Main\s*\(\s*string\[]\s+\w*\s*\)/, points: 2},
                // Event declaration
                {pattern: /event\s+\w+\s+\w+;/, points: 2},
            ],
            'SQL': [
                // Basic SQL Commands
                {pattern: /\b(SELECT|INSERT INTO|UPDATE|DELETE FROM)\b/, points: 2},
                // WHERE Clause
                {pattern: /\bWHERE\b/, points: 2},
                // JOIN Operations
                {pattern: /\b(JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN)\b/, points: 2},
                // Aggregate Functions
                {pattern: /\b(SUM|COUNT|AVG|MIN|MAX)\b/, points: 2},
                // GROUP BY, HAVING Clauses
                {pattern: /\b(GROUP BY|HAVING)\b/, points: 2},
                // Subquery
                {pattern: /\bSELECT\b.*\bFROM\b.*\b(SELECT\b)/, points: 2},
                // Table Creation
                {pattern: /\bCREATE TABLE\b/, points: 2},
                // Table Alteration
                {pattern: /\bALTER TABLE\b/, points: 2},
                // Table Dropping
                {pattern: /\bDROP TABLE\b/, points: 2},
                // Comments
                {pattern: /--.*$|\/\*[\s\S]*?\*\//, points: 1},
                // Data Types
                {pattern: /\b(INT|VARCHAR|CHAR|TEXT|DATE)\b/, points: 1},
                // Primary Key
                {pattern: /\bPRIMARY KEY\b/, points: 1},
                // Unique Constraint
                {pattern: /\bUNIQUE\b/, points: 1},
                // Check Constraint
                {pattern: /\bCHECK\b/, points: 1},
                // Foreign Key
                {pattern: /\bFOREIGN KEY\b/, points: 1}
            ],
            'TypeScript': [
                // TypeScript-specific types
                {pattern: /\b(string|number|boolean|any|void|never)\b/, points: 2},
                // Interfaces
                {pattern: /\binterface\b/, points: 2},
                // Type assertions
                {pattern: /<\w+>\w+/, points: 2},
                // Enums
                {pattern: /\benum\b/, points: 2},
                // Type Annotations
                {pattern: /\w+:\s*\w+/, points: 2},
                // Generics
                {pattern: /\b\w+<\w+>\b/, points: 2},
                // Decorators
                {pattern: /@\w+/, points: 2},
                // Access Modifiers
                {pattern: /\b(public|private|protected)\b/, points: 1},
                // Readonly
                {pattern: /\breadonly\b/, points: 1},
                // Modules and Namespaces
                {pattern: /\b(module|namespace)\b/, points: 1},
                // Tuple Types
                {pattern: /\[\w+(,\s*\w+)*]/, points: 1},
                // Optional Chaining
                {pattern: /\?\./, points: 1},
                // Nullish Coalescing
                {pattern: /\?\?/, points: 1},
                // Type Guards and Type Casting
                {pattern: /\bas\s+\w+/, points: 1},
                // Keyof Keyword
                {pattern: /\bkeyof\b/, points: 1},
                // Typeof and Instanceof
                {pattern: /\b(typeof|instanceof)\b/, points: 1}
            ],

            'Swift': [
                // Function Declarations
                {pattern: /func\s+\w+\(.*\)\s*->\s*\w+/, points: 2},
                // Class Declarations
                {pattern: /class\s+\w+(:\s*\w+)?\s*{/, points: 2},
                // Struct Declarations
                {pattern: /struct\s+\w+\s*{/, points: 2},
                // Variable Declarations
                {pattern: /var\s+\w+:\s*\w+/, points: 2},
                // Let (constant) Declarations
                {pattern: /let\s+\w+:\s*\w+/, points: 2},
                // Optional Types
                {pattern: /\w+\?\s*([={])/, points: 2},
                // Protocols
                {pattern: /protocol\s+\w+\s*{/, points: 2},
                // Extensions
                {pattern: /extension\s+\w+\s*{/, points: 2},
                // Swift-specific Keywords
                {pattern: /\b(self|guard|defer|inout|enum)\b/, points: 1},
                // Print statement
                {pattern: /print\(/, points: 1},
                // Swift Attributes
                {pattern: /@\w+/, points: 1},
                // Guard Statement
                {pattern: /guard\s+.*\s+else\s*{/, points: 1}
            ],
            
            'Objective-C': [
                // Import Statements
                {pattern: /#import\s+<\w+\/\w+\.h>/, points: 2},
                // Interface Declarations
                {pattern: /@interface\s+\w+\s*:\s*\w+/, points: 2},
                // Implementation Declarations
                {pattern: /@implementation\s+\w+/, points: 2},
                // Method Declarations
                {pattern: /[-+]\s*\(\w+\s*\*\)\w+:/, points: 2},
                // Property Declarations
                {pattern: /@property\s*\(.*\)\s*\w+\s*\*\w+;/, points: 2},
                // Objective-C Synthesize
                {pattern: /@synthesize\s+\w+/, points: 1},
                // Objective-C Dynamic
                {pattern: /@dynamic\s+\w+/, points: 1},
                // Square Bracket Syntax
                {pattern: /\[\w+\s+\w+.*]/, points: 2},
                // NS Types and Macros
                {pattern: /NS\w+/, points: 1},
                // Selector
                {pattern: /@selector\(\w+\)/, points: 1},
                // Protocol
                {pattern: /<\w+>/, points: 1}
            ],
            'Kotlin': [
                // Function Declarations
                {pattern: /fun\s+\w+\(.*\)(\s*:\s*\w+)?\s*{/, points: 2},
                // Class Declarations
                {pattern: /class\s+\w+(\s*:\s*\w+\(\))?\s*{/, points: 2},
                // Variable Declarations
                {pattern: /val\s+\w+\s*:\s*\w+\s*=/, points: 2},
                // Companion Object
                {pattern: /companion\s+object\s*{/, points: 2},
                // Data Class
                {pattern: /data\s+class\s+\w+\(.*\)/, points: 2},
                // Extension Functions
                {pattern: /fun\s+\w+\.\w+\(.*\)\s*{/, points: 2},
                // Coroutines
                {pattern: /suspend\s+fun\s+\w+/, points: 2},
                // println statement
                {pattern: /println\(/, points: 1}
            ],
            'Scala': [
                // Object Declaration
                {pattern: /object\s+\w+\s*{/, points: 2},
                // Class Declaration
                {pattern: /class\s+\w+(\(.*\))?(\s+extends\s+\w+)?\s*{/, points: 2},
                // Def (Function) Declarations
                {pattern: /def\s+\w+\(.*\)\s*:\s*\w+\s*=/, points: 2},
                // Variable Declarations
                {pattern: /val\s+\w+\s*:\s*\w+\s*=/, points: 2},
                // Case Classes
                {pattern: /case\s+class\s+\w+\(.*\)/, points: 2},
                // Traits
                {pattern: /trait\s+\w+\s*{/, points: 2},
                // Pattern Matching
                {pattern: /\w+\s+match\s*{/, points: 2}
            ],
            'Perl': [
                // Scalar Variables
                {pattern: /\$\w+/, points: 2},
                // Array Variables
                {pattern: /@\w+/, points: 2},
                // Hash Variables
                {pattern: /%\w+/, points: 2},
                // Subroutine Declarations
                {pattern: /sub\s+\w+\s*{/, points: 2},
                // Regular Expressions
                {pattern: /m\/.*\/[gim]?/, points: 2},
                // Print statement
                {pattern: /print\s*".*"/, points: 1}
            ],
            'Bash': [
                // Shebang
                {pattern: /#!\/bin\/bash/, points: 2},
                // Variable Assignment
                {pattern: /\w+=\w+/, points: 2},
                // Function Declaration
                {pattern: /function\s+\w+\s*{/, points: 2},
                // Echo Command
                {pattern: /echo\s+-e\s+".*"/, points: 1},
                // Conditional Statements
                {pattern: /if\s+\[.*];\s+then/, points: 2},
                // Loops
                {pattern: /(for|while)\s+\w+\s+in\s+\w+;/, points: 2}
            ],
            'R': [
                // Function Definition
                {pattern: /\w+\s*<-\s*function\(\s*\)/, points: 2},
                // Variable Assignment
                {pattern: /\w+\s*<-\s*\w+/, points: 2},
                // Library or Require
                {pattern: /(library|require)\(\w+\)/, points: 2},
                // Data Frame
                {pattern: /data.frame\(/, points: 2},
                // ggplot
                {pattern: /ggplot\(/, points: 2},
                // Comments
                {pattern: /#.*$/, points: 1}
            ],



            'Unknown': [],
        };

        window.DetectLang = this;
    }

    getPoints(language, lineOfCode, checkers) {
        return _.reduce(_.map(checkers, function (checker) {
            if (checker.pattern.test(lineOfCode)) {
                return checker.points;
            }
            return 0;
        }), function (memo, num) {
            return memo + num;
        }, 0);
    }

    detect(snippet, options) {
        const opts = _.defaults(options || {}, {
            heuristic: true,
            statistics: false,
        });

        let linesOfCode = snippet
            .replace(/\r\n?/g, '\n')
            .replace(/\n{2,}/g, '\n')
            .split('\n');

        const nearTop = (index) => linesOfCode.length <= 10 || index < linesOfCode.length / 10;

        if (opts.heuristic && linesOfCode.length > 500) {
            linesOfCode = linesOfCode.filter((line, index) => nearTop(index) || index % Math.ceil(linesOfCode.length / 500) === 0);
        }

        const pairs = _.keys(this.languages).map(key => ({ language: key, checkers: this.languages[key] }));

        const results = pairs.map(({ language, checkers }) => {
            const pointsList = linesOfCode.map((line, index) => {
                const relevantCheckers = nearTop(index) ? checkers : _.reject(checkers, checker => checker.nearTop);
                return this.getPoints(language, line, relevantCheckers);
            });

            const points = _.reduce(pointsList, (memo, num) => memo + num, 0);
            return { language, points };
        });

        const bestResult = _.max(results, result => result.points);

        if (opts.statistics) {
            const statistics = results.map(result => [result.language, result.points]).sort((a, b) => b[1] - a[1]);
            return { detected: bestResult.language, statistics };
        }

        return bestResult.language;
    }

    splitIntoLanguageChunks(text) {
        let lines = String(text).split('\n');
        let chunks = [];
        let currentChunk = {language: this.detect(lines[0]), lines: []};

        lines.forEach(line => {
            let detectedLanguage = this.detect(line);

            if (detectedLanguage !== currentChunk.language) {
                // Language change detected, start a new chunk
                if (currentChunk.lines.length > 0) {
                    chunks.push(currentChunk);
                }
                currentChunk = {language: detectedLanguage, lines: [line]};
            } else {
                // Same language, continue adding lines to the current chunk
                currentChunk.lines.push(line);
            }
        });

        // Add the last chunk
        if (currentChunk.lines.length > 0) {
            chunks.push(currentChunk);
        }

        return chunks.map(chunk => ({
            language: chunk.language,
            text: chunk.lines.join('\n')
        }));
    }
}



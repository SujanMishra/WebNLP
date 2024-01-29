[WEBNLP]
Introduction

This project is a work in progress, with updates coming as I continue coding.
Main Ideas

My aim is to create a dynamic browser extension that leverages Natural Language Processing (NLP) and Machine Learning (ML). The key features include:

    Provider Flexibility: Ability to integrate various NLP providers such as OpenAI, local Large Language Models (LLMs), and custom LLM endpoints.
    User-Friendly Integration: An easy-to-use interface for adding new providers.
    Chat Interface: An engaging and interactive chat functionality.
    Visual Scripting for RAG Pipeline & Agent Network: A drag-and-drop interface for designing Retriever-Augmented Generation (RAG) Pipelines and managing agent networks, including nodes for managers, workers, etc.
    Provider Mix-and-Match: Flexibility to assign different providers to different nodes, like using OpenAI for a manager and a local LLM for a worker.
    Shareable Configurations: Enabling the sharing of Agent Networks and RAG Pipelines as simple JSON files.
    Cross-Platform Native App: Developing native applications for Windows, Mac, and Linux to address cross-origin issues and enhance system app integration.

Current Progress

So far, I've developed:

    Sidebar Extension Interface: Resembling Bing, with resizable UI components.
    HTTP & Remote Services Integration: Establishing a foundation for service communication.
    Provider Selection: Ability for users to choose from different LLM providers.
    Chat and History Functions: Basic chat functionality along with conversation history tracking.
    Topic Creation: Capability for users to create and manage topics within the chat.
    Code-Friendly Features: Syntax highlighting and language detection for code snippets.

ToDo and WIP

    Testing: Comprehensive testing of all features, including cross-origin resource sharing (CORS) compatibility with OpenAI and Anyscale.
    Native Application Development: If required, to handle CORS restrictions and manage local LLMs.
    Visual Scripting Implementation: For both RAG pipelines and Agent Networks.
    Browser Compatibility: Extending support to Firefox, addressing Manifest V2/V3 issues.
    Comprehensive Development: Covering all the planned features and functionalities.

Pain Points

    Browser Extension Limitations: The current design restricts interaction with system apps, databases (except IndexedDB), and external APIs not supporting CORS, severely limiting the extension's capabilities.
    Security and Compatibility Challenges: Due to CORS and other security concerns, using external libraries is problematic, often necessitating writing code from scratch.
    Browser-Specific Issues: Currently, the extension works only with Chrome and Internet Explorer. Adding Firefox support is challenging due to manifest version differences.
    Multimedia Constraints: Directly capturing audio and video through the extension is not feasible without tunneling through a native app.

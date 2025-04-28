class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}


// 1. Node.js Error Class Basics:
// Error class: In Node.js, Error is a built-in class that represents runtime errors. It has three main properties:

// message: Contains a human-readable string describing the error.

// stack: A string representing the stack trace (function calls leading to the error).

// name: The name of the error (e.g., Error).

// 2. Inheriting from Error:
// Why inherit from Error?: By inheriting from the Error class, you gain access to its properties (message, stack, name) and can customize them further in your own error class (e.g., ApiError).

// Using super(message): Calling super(message) in the child class constructor invokes the parent (Error) constructor, initializing the message property of the Error class. This is necessary for the message property to be properly set when you create an instance of the custom error class.

// 3. Error.captureStackTrace():
// Purpose: Error.captureStackTrace(this, this.constructor) is a special method that captures the stack trace and assigns it to the stack property of the this instance (current object). It’s used for generating the stack trace when you manually handle errors.

// How it works: It allows the stack trace to be created and attached to your custom error class without manually managing it. It excludes the constructor itself to provide a cleaner trace.

// Important: If you don't manually define a stack property in the child class, captureStackTrace() will automatically create and assign it. If you manually set stack (e.g., this.stack = "custom stack"), it won't override it.

// 4. Child Class Properties (message, stack):
// Property Shadowing: If the child class defines a property with the same name as the parent (message, stack), it will shadow the parent class's property. In that case, the child class's value will take precedence, and the parent property will be ignored.

// Why not directly use message and stack from the parent?: Although you can access the parent class's properties, it's often helpful to provide specific error handling features in your child class (e.g., adding an errors array or customizing how the stack is generated).

// 5. Why Use ApiError?
// Customizing the Error: ApiError allows you to customize errors by adding additional fields like statusCode, errors, or success while still inheriting the behavior of the base Error class (like message and stack).
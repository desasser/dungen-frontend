import React from 'react'
//error boundary

class ErrorBoundary extends React.Component {
    constructor(props){
        super(props);
        this.state = {hasError : false}
    }

    static getDervidedStateFromError(error){
        return{hasError: true}
    }

    componentDidCatch(error) {
        //console.log the problem
    }
    
    render(){
        if (this.state.hasError) {
            return (
                <div>
                    Looks like there's a problem. Sorry, pal.
                </div>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary
import React from 'react'
import './NotFound.css'

export default function NotFound(props) {
    return (<>
            <section className="container">
                <div className="text-center empty">
                    <h2>{props.title}</h2>
                    <h5>{props.details}</h5>
                </div>
            </section>
        </>
    )
}
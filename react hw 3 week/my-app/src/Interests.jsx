import photo5 from './assets/IMG_2755.jpg'
import photo6 from './assets/IMG_4142 (1).JPG'
import photo7 from './assets/IMG_1998.JPG'
import photo8 from './assets/IMG_4015.JPG'

function Interests(){
    return(
        <>
        <section className="interests">
            <div className="interests-text">
                <h2>INTERESTS</h2>
                <p>
                    My interests are a mix of technology and creativity. 
                    I enjoy web development, photography, video and visual design, especially when I can combine them in one project. 
                    I like exploring new tools, experimenting with ideas and turning small concepts into something real. 
                    I'm also interested in how people interact with digital products and what makes a website or application feel simple, useful and visually interesting. 
                    For me, learning is mostly about trying things out, making mistakes and seeing what I can create next.
                </p>
            </div>
        </section>

            <section className="interests-photos">
                <img src={photo5} alt="Photography " />
                <img src={photo6} alt="Sham theatre " />
                <img src={photo7} alt="Work" />
                <img src={photo8} alt="Filmmaking" />
            </section>
        </>
    )
}

export default Interests
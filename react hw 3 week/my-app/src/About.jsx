import photo1 from './assets/IMG_4650.PNG'
import photo2 from './assets/IMG_3178.JPG'
import photo3 from './assets/IMG_3327.JPG'
import photo4 from './assets/IMG_8160.JPG'
function About(){
  return (
    <section className='about'>
        <div className="about-text">
            <h2>ABOUT ME</h2>
            <p>I'm 20 years old</p>
            <p>I was born in Almaty</p>
            <p>4th year student of KBTU</p>
            <p>I'm interested in design and visual content</p>
        </div>
        
        <div className="about-photos">
            <img src={photo1} alt="Me with a camera" />
            <img src={photo2} alt="Kbtu" />
            <img src={photo3} alt="My books" />
            <img src={photo4} alt="Me and mountain" />
        </div>

    </section>
  )
}


export default About
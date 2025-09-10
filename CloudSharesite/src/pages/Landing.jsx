import React, { useEffect } from 'react'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import CtaSection from '../components/landing/CtaSection'
import Footer from '../components/landing/Footer'
import Herosection from '../components/landing/Herosection'
import FeaturesSection from '../components/landing/FeaturesSection'
import PriceSection from '../components/landing/PriceSection'
import { features, pricingPlans,testimonials} from '../data'
import { useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {

const {openSignIn,openSignUp}=useClerk();
const {isSignedIn}=useClerk();
const navigate=useNavigate();


useEffect(()=>{
  if(isSignedIn){

    navigate('/dashboard') // Redirect to dashboard if user is signed in

  }
},[isSignedIn,navigate])


  return (
     <div className="landing-page">
       <div className="landing-page-content">
         <Herosection openSignIn={openSignIn} openSignUp={openSignUp} />
         <FeaturesSection  features={features}/>
         <PriceSection pricingPlans={pricingPlans} openSignUp={openSignUp}/>
         <TestimonialsSection testimonials={testimonials}/>
         <CtaSection openSignUp={openSignUp}/>
        <Footer/>
       </div>
     </div>
  )
}

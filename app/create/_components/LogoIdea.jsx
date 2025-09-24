
// components/LogoIdea.jsx
import React, { useEffect, useState } from 'react';
import HeadingDescription from './HeadingDescription';
import Lookup from '../../_data/Lookup';
import axios from 'axios';
import Prompt from "../../_data/Prompt";
import { Loader2Icon } from 'lucide-react';

function LogoIdea({onHandleInputChange,formData}) {
  const [loading, setLoading] = useState(false);
  const [logoIdea, setLogoIdea] = useState([]);
  const [error, setError] = useState(null);
  const [selectedIdea,setSelectedIdea]=useState('');
  useEffect(() => {
    generateLogoDesignIdea();
  }, []);

  const generateLogoDesignIdea = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const prompt = Prompt.DESIGN_IDEA_PROMPT
        .replace('{logoType}', formData?.design?.title || '')
        .replace('{logoTitle}', formData?.title || '')
        .replace('{logoDesc}', formData?.desc || '')
        .replace('{logoPrompt}', formData?.design?.prompt || '');
      
      console.log('Generated prompt:', prompt);
      
      const result = await axios.post("/api/ai-design-idea", {
        prompt
      });
      console.log(result)
      console.log('API Response:', result.data);
      setLogoIdea(result.data.ideas);
      
    } catch (error) {
      console.error('Error generating logo idea:', error);
      setError('Failed to generate logo idea. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='my-10'>
      <HeadingDescription 
        title={Lookup.LogoIdeaTitle} 
        description={Lookup.LogoIdeaDesc} 
      />
      <div className='flex justify-center items-center'>
      {loading && (
        <Loader2Icon className='animate-spin my-10 flex' />
      )}
      </div>
      
      {error && (
        <div className="mt-4 text-red-600">
          <p>{error}</p>
        </div>
      )}
      
      {
        logoIdea.length>0&&<div className='flex gap-3 flex-wrap mt-2'> 
            {
              logoIdea.map((idea,index)=>(
                <div key={index} className={`px-2 py-1 text-center bg-gray-100 rounded-md cursor-pointer ${selectedIdea==idea&&'border-2 border-primary'}`}
                onClick={()=>{setSelectedIdea(idea) ; onHandleInputChange(idea)}}>
                   {idea}
                </div>
              ))
            }
           </div>
      }
    </div>
  );
}

export default LogoIdea;
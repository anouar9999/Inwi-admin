"use client"
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { Check, User, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PrizePoolInput from './numberInput';
import ParticipantInput from './participantInput';
import TeamSizeInput from './TeamInput';
import { useToast } from '@/utils/ToastProvider';
import LoadingOverlay from './Loading';

const ParticipationTypeToggle = ({ value, onChange }) => {
  const types = [
    { id: 'participant', icon: User, label: 'Participant Individuel' },
    { id: 'team', icon: Users, label: 'Équipe' }
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">Type de Participation</label>
      <div className="grid grid-cols-2 gap-4">
        {types.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange({ target: { name: 'participation_type', value: id } })}
            className={`
              relative flex items-center  angular-cut p-3 rounded-lg bg-gray-800 transition-all duration-200
              ${value === id 
                ? ' bg-primary/10 text-primary' 
                : '  text-gray-300'}
            `}
          >
            <div className="flex items-center space-x-2">
              <Icon className={`w-5 h-5 ${value === id ? 'text-primary' : 'text-gray-400'}`} />
              <span className="font-medium">{label}</span>
            </div>
            
            {value === id && (
              <div className="absolute top-2 right-2">
                <Check className="w-4 h-4 text-primary" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
const TournamentCreation = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [Loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nom_des_qualifications: '',
    competition_type: 'Valorant',
    participation_type: 'participant',
    start_date: '',
    end_date: '',
    status: 'Ouvert aux inscriptions',
    description_des_qualifications: '',
    rules: '',
    nombre_maximum: '',
    prize_pool: '',
    format_des_qualifications: 'Single Elimination',
    type_de_match: '',
    type_de_jeu: '',
    image: null
  });

  const competitionTypes = {
    valorant: {
      title: 'Valorant',
      image: 'https://www.riotgames.com/darkroom/1440/8d5c497da1c2eeec8cffa99b01abc64b:5329ca773963a5b739e98e715957ab39/ps-f2p-val-console-launch-16x9.jpg',
    },
    freeFire: {
      title: 'Free Fire',
      image: 'https://asset-2.tstatic.net/toraja/foto/bank/images/05082023_Free_Fire_2.jpg',
    },
  };

  const statusOptions = [
    'Ouvert aux inscriptions',
    'En cours',
    'Terminé',
    'Annulé'
  ];

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          showToast.error("L'image ne doit pas dépasser 5MB");
          return;
        }

        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          showToast.error("Format d'image non supporté. Utilisez JPG, PNG ou GIF");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
        
        setFormData(prev => ({ ...prev, [name]: file }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'nom_des_qualifications',
      'start_date',
      'end_date',
      'image'
    ];

    const emptyFields = requiredFields.filter(field => !formData[field]);
    if (emptyFields.length > 0) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error', 1500);

      return false;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    if (startDate > endDate) {
      showToast('La date de fin doit être après la date de début', 'error', 1500);

      return false;
    }

    // Validate based on participation type
    if (formData.participation_type === 'team' && !formData.nombre_maximum) {
      showToast('Veuillez spécifier le nombre maximum d\'équipes', 'error', 1500);

      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    setLoading(true);
    const formDataToSend = new FormData();
    
    try {
      // Add all non-empty form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formDataToSend.append(key, value);
        }
      });
  
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${apiUrl}/api/new_tournament.php`, {
        method: 'POST',
        body: formDataToSend,
      });
  
      // Handle non-200 responses
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Erreur lors de la création du tournoi');
        } catch (e) {
          console.error('Server response:', errorText);
          throw new Error('Erreur de serveur inattendue');
        }
      }
  
      const data = await response.json();
  
      showToast('Tournoi créé avec succès!', 'success', 1500);
      setTimeout(() => router.push('/dashboards/tournaments'), 1500);
    } catch (error) {
      console.error('Submission error:', error);
      showToast(error.message || 'Une erreur est survenue', 'error', 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-300 min-h-screen p-4">
    {
      !Loading ?   <div className="mx-auto">
      <h1 className="text-5xl  font-custom mb-2">NOUVEAU TOURNOI</h1>
      <p className="text-gray-500 mb-8">Créez un tournoi et définissez les préférences.</p>

      <div className="space-y-8">
       

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tournament Image */}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 h-32 object-cover rounded-lg angular-cut"
              />
            )}  
            <div>
            <label className="block text-sm font-medium mb-2">Image du Tournoi</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
               className={` w-full  rounded-lg  p-3 file:mr-4 file:py-2 file:px-4 
              file:rounded-full file:border-0 file:text-sm file:bg-gray-600 bg-gray-800
              file:text-gray-300 hover:file:bg-gray-600 cursor-pointer angular-cut`}
          />
            
        
          </div>
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nom des Qualifications <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom_des_qualifications"
                value={formData.nom_des_qualifications}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                required
              />
            </div>
            
            <ParticipationTypeToggle 
              value={formData.participation_type}
              onChange={handleChange}
            />
          </div>
          {/* Dates and Status */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Date de Début</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date de Fin</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Participants and Prize Pool */}
          <div className="grid grid-cols-3 gap-6">
            {formData.participation_type === 'team' ? (
             <TeamSizeInput
             value={formData.nombre_maximum}
             onChange={handleChange}
           />
            ) : (
              <ParticipantInput
                value={formData.nombre_maximum}
                onChange={handleChange}
              />
            )}
            
            <div>
              <label className="block text-sm font-medium mb-2">Format des Qualifications</label>
              <select
                name="format_des_qualifications"
                value={formData.format_des_qualifications}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
              >
                <option className='angular-cut'>Single Elimination</option>
                <option>Double Elimination</option>
                <option>Round Robin</option>
              </select>
            </div>
            
            <PrizePoolInput value={formData.prize_pool} onChange={handleChange} />
          </div>

          {/* Description and Rules */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Description des Qualifications</label>
              <textarea
                name="description_des_qualifications"
                value={formData.description_des_qualifications}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Règles du Tournoi</label>
              <textarea
                name="rules"
                value={formData.rules}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                rows="4"
              />
            </div>
          </div>

          {/* Match Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Type de Match</label>
              <input
                type="text"
                name="type_de_match"
                value={formData.type_de_match}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 ">Type de Jeu</label>
              <input
                type="text"
                name="type_de_jeu"
                value={formData.type_de_jeu}
                onChange={handleChange}
                className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
              />
            </div>
          </div>

        

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 angular-cut bg-primary text-white  hover:bg-primary/90 transition-colors"
            >
              CRÉER LE TOURNOI
            </button>
          </div>
        </form>
      </div>
    </div>  : <LoadingOverlay/>
    }
    </div>
  );
};

export default TournamentCreation;
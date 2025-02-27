export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  export const competitionTypes = {
      valorant: {
        title: 'Valorant',
        image: 'https://www.riotgames.com/darkroom/1440/8d5c497da1c2eeec8cffa99b01abc64b:5329ca773963a5b739e98e715957ab39/ps-f2p-val-console-launch-16x9.jpg',
      },
      freeFire: {
        title: 'Free Fire',
        image: 'https://asset-2.tstatic.net/toraja/foto/bank/images/05082023_Free_Fire_2.jpg',
      },
      StreetFighter: {
        title: 'Street Fighter',
        image: 'https://mms.businesswire.com/media/20230122005015/fr/1692292/5/p1-1.jpg',
      },
      FcFootball: {
        title: 'Fc Football',
        image: 'https://e.sport.fr/wp-content/uploads/2023/07/2x1_NSwitch_EaSportsFc24_image1600w.jpg',
      },
    };
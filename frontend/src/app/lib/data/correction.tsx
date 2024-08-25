export const deleteCorrection = async (correctionId: number) => {
    try {
      const response = await fetch(`/api/data/lab/1/delete-correction?id=${correctionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete correction');
      }
      const result = await response.json();
      console.log(result.message); // Handle success message
    } catch (error) {
      console.error('Error:', error.message); // Handle error
    }
  };
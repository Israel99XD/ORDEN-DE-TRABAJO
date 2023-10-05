document.getElementById('generate-pdf').addEventListener('click', async (event) => {
    const id = event.currentTarget.getAttribute("data-id"); // Utiliza event.currentTarget
    const response = await fetch(`/generate-pdf/${id}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'archivo.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
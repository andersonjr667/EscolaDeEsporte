document.addEventListener("DOMContentLoaded", () => {
    console.log("Página inicial carregada");

    const token = localStorage.getItem('token');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin') {
            document.getElementById('create-post-btn').classList.remove('d-none');
        }
    }

    document.getElementById('create-post-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', document.getElementById('post-title').value);
        formData.append('text', document.getElementById('post-text').value);
        formData.append('image', document.getElementById('post-image').files[0]);
        formData.append('video', document.getElementById('post-video').files[0]);
        const files = document.getElementById('post-files').files;
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            if (response.ok) {
                alert('Post criado com sucesso!');
                location.reload();
            } else {
                const errorData = await response.json();
                alert(`Erro ao criar post: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Erro ao criar post:", error);
        }
    });
});

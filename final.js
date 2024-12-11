document.addEventListener("DOMContentLoaded", () => {
    const postsContainer = document.getElementById("posts");
    const addPostButton = document.getElementById("add-post");
    const postTitleInput = document.getElementById("title");
    const postBodyInput = document.getElementById("body");
  
    // Function to fetch and display posts
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const posts = await response.json();
  
        postsContainer.innerHTML = "<h2>Posts</h2>"; // Clear and reset the posts container
  
        posts.slice(0, 10).forEach((post) => {
          const postElement = createPostElement(post);
          postsContainer.appendChild(postElement);
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
  
    // Function to create a post element
    const createPostElement = (post) => {
      const postElement = document.createElement("div");
      postElement.className = "post";
      postElement.dataset.id = post.id;
  
      postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        <button class="edit-post">Edit</button>
        <button class="delete-post">Delete</button>
      `;
  
      return postElement;
    };
  
    // Add a new post
    addPostButton.addEventListener("click", async () => {
      const title = postTitleInput.value.trim();
      const body = postBodyInput.value.trim();
  
      if (!title || !body) {
        alert("Please fill out both title and content.");
        return;
      }
  
      const newPost = { title, body, userId: 1 };
  
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPost),
        });
  
        const createdPost = await response.json();
        const postElement = createPostElement(createdPost);
        postsContainer.appendChild(postElement);
  
        postTitleInput.value = "";
        postBodyInput.value = "";
      } catch (error) {
        console.error("Error adding post:", error);
      }
    });
  
    // Edit or delete a post
    postsContainer.addEventListener("click", async (event) => {
      const postElement = event.target.closest(".post");
      const postId = postElement?.dataset.id;
  
      if (event.target.classList.contains("edit-post")) {
        // Edit Post
        const currentTitle = postElement.querySelector("h3").textContent;
        const currentBody = postElement.querySelector("p").textContent;
  
        const newTitle = prompt("Edit Post Title:", currentTitle);
        const newBody = prompt("Edit Post Content:", currentBody);
  
        if (!newTitle || !newBody) {
          alert("Title and content cannot be empty.");
          return;
        }
  
        const updatedPost = { title: newTitle, body: newBody, userId: 1 };
  
        try {
          await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedPost),
          });
  
          postElement.querySelector("h3").textContent = newTitle;
          postElement.querySelector("p").textContent = newBody;
        } catch (error) {
          console.error("Error updating post:", error);
        }
      } else if (event.target.classList.contains("delete-post")) {
        // Delete Post
        try {
          await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: "DELETE",
          });
  
          postElement.remove();
        } catch (error) {
          console.error("Error deleting post:", error);
        }
      }
    });
  
    // Initial fetch of posts
    fetchPosts();
  });
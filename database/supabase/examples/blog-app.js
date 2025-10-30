import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://your-project-ref.supabase.co';
const supabaseKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Blog App Example with Supabase
class BlogApp {
  constructor() {
    this.currentUser = null;
    this.posts = [];
    this.comments = [];
    this.subscriptions = [];
  }

  // Authentication methods
  async signUp(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      this.currentUser = data.user;
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      this.currentUser = null;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      this.currentUser = user;
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Post methods
  async createPost(postData) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          ...postData,
          author_id: this.currentUser.id,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  }

  async getPosts(options = {}) {
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles(username, avatar_url),
          categories(name, slug),
          post_tags(tags(name))
        `);

      // Apply filters
      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.categoryId) {
        query = query.eq('category_id', options.categoryId);
      }

      if (options.authorId) {
        query = query.eq('author_id', options.authorId);
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending || false });
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      this.posts = data;
      return data;
    } catch (error) {
      console.error('Get posts error:', error);
      throw error;
    }
  }

  async getPost(slug) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(username, avatar_url, bio),
          categories(name, slug),
          comments(
            id,
            content,
            created_at,
            author:profiles(username, avatar_url)
          )
        `)
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get post error:', error);
      throw error;
    }
  }

  async updatePost(postId, updates) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Update post error:', error);
      throw error;
    }
  }

  async deletePost(postId) {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    }
  }

  // Comment methods
  async createComment(commentData) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          ...commentData,
          author_id: this.currentUser.id,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Create comment error:', error);
      throw error;
    }
  }

  async getComments(postId) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:profiles(username, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get comments error:', error);
      throw error;
    }
  }

  // Like methods
  async toggleLike(postId) {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', this.currentUser.id)
        .single();

      if (existingLike) {
        // Remove like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', this.currentUser.id);
        
        if (error) throw error;
        return false; // Unliked
      } else {
        // Add like
        const { data, error } = await supabase
          .from('likes')
          .insert([{
            post_id: postId,
            user_id: this.currentUser.id
          }])
          .select();
        
        if (error) throw error;
        return true; // Liked
      }
    } catch (error) {
      console.error('Toggle like error:', error);
      throw error;
    }
  }

  // Subscription methods
  async subscribeToNewsletter(email) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([{
          email,
          subscribed_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Subscribe error:', error);
      throw error;
    }
  }

  // Real-time subscriptions
  subscribeToPosts(callback) {
    return supabase
      .channel('public:posts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => callback(payload)
      )
      .subscribe();
  }

  subscribeToComments(postId, callback) {
    return supabase
      .channel(`public:comments:post_id=eq.${postId}`)
      .on('postgres_changes',
        { 
          event: 'INSERT',
          schema: 'public', 
          table: 'comments',
          filter: `post_id=eq.${postId}`
        },
        (payload) => callback(payload)
      )
      .subscribe();
  }

  // File upload methods
  async uploadFile(file, bucket = 'uploads') {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${this.currentUser.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { data, publicUrl };
    } catch (error) {
      console.error('Upload file error:', error);
      throw error;
    }
  }

  // Search methods
  async searchPosts(query) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(username, avatar_url)
        `)
        .textSearch('title', query)
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Search posts error:', error);
      throw error;
    }
  }

  // Initialize app
  async init() {
    // Get current user
    await this.getCurrentUser();
    
    // Set up auth state listener
    supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser = session?.user || null;
      console.log('Auth state changed:', event, session);
    });
  }
}

// Usage example
const blogApp = new BlogApp();

// Initialize the app
blogApp.init().then(() => {
  console.log('Blog app initialized');
  console.log('Current user:', blogApp.currentUser);
});

// Example usage functions
async function exampleUsage() {
  try {
    // Sign up a new user
    const newUser = await blogApp.signUp(
      'user@example.com',
      'password123',
      { username: 'newuser', first_name: 'New', last_name: 'User' }
    );
    console.log('New user:', newUser);

    // Sign in
    await blogApp.signIn('user@example.com', 'password123');
    console.log('Signed in as:', blogApp.currentUser);

    // Create a post
    const newPost = await blogApp.createPost({
      title: 'My First Post',
      slug: 'my-first-post',
      content: 'This is the content of my first post.',
      excerpt: 'First post excerpt',
      status: 'published'
    });
    console.log('New post:', newPost);

    // Get all published posts
    const posts = await blogApp.getPosts({ 
      status: 'published',
      orderBy: 'created_at',
      limit: 10
    });
    console.log('Posts:', posts);

    // Subscribe to real-time updates
    const subscription = blogApp.subscribeToPosts((payload) => {
      console.log('Post update:', payload);
    });

    // Upload a file
    const fileInput = document.getElementById('file-input');
    if (fileInput.files.length > 0) {
      const uploadResult = await blogApp.uploadFile(fileInput.files[0]);
      console.log('File uploaded:', uploadResult);
    }

  } catch (error) {
    console.error('Example usage error:', error);
  }
}

export { BlogApp, exampleUsage };
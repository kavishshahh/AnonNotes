import { useEffect, useState } from 'react';
import { Image, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';

import { darkTheme } from '../_layout';
import { ThemedText } from './ThemedText';

interface LinkPreviewProps {
  url: string;
}

interface PreviewData {
  title?: string;
  description?: string;
  image?: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPreview();
  }, [url]);

  const fetchPreview = async () => {
    try {
      setLoading(true);
      setError(false);
      
      // Use a proxy service to avoid CORS issues
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const html = await response.text();
      
      const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i);
      const descriptionMatch = html.match(/<meta property="og:description" content="([^"]+)"/i);
      const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);

      // Fallback to regular title tag if no OG title is found
      const fallbackTitleMatch = titleMatch ? null : html.match(/<title>([^<]+)<\/title>/i);

      setPreview({
        title: titleMatch?.[1] || fallbackTitleMatch?.[1] || '',
        description: descriptionMatch?.[1],
        image: imageMatch?.[1],
      });
    } catch (err) {
      console.error('Error fetching preview:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    Linking.openURL(url).catch((err) => console.error('Error opening link:', err));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.loading}>Loading preview...</ThemedText>
      </View>
    );
  }

  if (error || !preview) {
    return (
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        <ThemedText style={styles.url}>{url}</ThemedText>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {preview.image && (
        <Image
          source={{ uri: preview.image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        {preview.title && (
          <ThemedText style={styles.title} numberOfLines={2}>
            {preview.title}
          </ThemedText>
        )}
        {preview.description && (
          <ThemedText style={styles.description} numberOfLines={3}>
            {preview.description}
          </ThemedText>
        )}
        <ThemedText style={styles.url} numberOfLines={1}>
          {url}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.border,
    overflow: 'hidden',
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: darkTheme.background,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: darkTheme.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: darkTheme.textSecondary,
    marginBottom: 8,
  },
  url: {
    fontSize: 12,
    color: darkTheme.primary,
  },
  loading: {
    padding: 12,
    color: darkTheme.textSecondary,
  },
}); 
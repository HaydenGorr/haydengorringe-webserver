import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { Url } from 'next/dist/shared/lib/router/router';

interface props {
    className?: string;
    onImageUpload: (file: File) => void;
    article_file: File|null;
    on_file_change: (a: File|null) => void;
}

export default function MDXUpload({className, onImageUpload, article_file, on_file_change}:props) {
const acceptedTypes = ['text/markdown', 'text/plain', 'text/mdx', 'text/md'];
const [preview, setPreview] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);
const fileInputRef = useRef<HTMLInputElement>(null);
const maxSizeBytes = 50;
const maxSizeBits = maxSizeBytes*8e+6;

// useEffect(() => {
//     let objectUrl: string;
//     if (article_file != null) {
//         objectUrl = URL.createObjectURL(article_file);
//         setPreview(objectUrl);
//     }

//     return () => {
//         if (objectUrl) {
//             URL.revokeObjectURL(objectUrl);
//         }
//     };
// }, [article_file]);

const validateFile = (file: File): boolean => {
    setError(null);

    if (!acceptedTypes.includes(file.type)) {
        setError(`Invalid file type. Please upload ${acceptedTypes.join(', ')}`);
        return false;
    }

    if (file.size > maxSizeBits) {
        setError(`File size must be less than 50MB`);
        return false;
    }

    return true;
};

const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
};

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        handleFile(file);
    }
};

const handleFile = (file: File) => {
    if (validateFile(file)) {
        on_file_change(file);
        
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        
        onImageUpload(file);
    }
};

const removeImage = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    on_file_change(null)
};

return (
    <div className={`w-full ${className}`}>
        <span className="text-base text-gray-400">{"Markdown"}</span>
        <div
            className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
            ${error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'}`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
        >
        <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={acceptedTypes.join(',')}
            onChange={handleChange}
        />

        {preview ? (
        <div className="relative inline-block">
            <button>Got article</button>
        </div>
        ) : (
        <div className="space-y-2">
            <Upload className="mx-auto text-gray-400" size={32} />
            <div className="text-sm text-gray-500">
                Drop your image here or click to browse
            </div>
            <div className="text-xs text-gray-400">
                Accepted types: {acceptedTypes.join(', ')}
                <br />
                Max size: 50MB
            </div>
        </div>
        )}
    </div>

        { preview && <button
            className='bg-blue-300 px-2 py-1 rounded-full text-black mt-1' 
            onClick={()=>{onImageUpload(article_file as File)}}>upload</button>}

        {error && (
            <div className="mt-2 text-sm text-red-500">{error}</div>
        )}
    </div>
);
};
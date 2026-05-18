"use client";

import { JSX, useEffect, useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import type { Blog } from "@/app/api/blogs/route";
import axios, { AxiosResponse } from "axios";
import { ImageIcon, Bold, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, Minus, Italic, Underline, Link, Trash2, X } from "lucide-react";

type BlockType = "paragraph" | "heading1" | "heading2" | "heading3" | "bold" | "image" | "bullet-list" | "numbered-list" | "quote" | "code" | "divider" | "urls";

interface ContentBlock {
    id: string;
    type: BlockType;
    content: string;
    indent?: number; // For nested lists
}

interface SlashOption {
    type: BlockType;
    label: string;
    icon: JSX.Element;
    description: string;
}

const slashOptions: SlashOption[] = [
    { type: "heading1", label: "Heading 1", icon: <Heading1 className="w-4 h-4" />, description: "Large section heading" },
    { type: "heading2", label: "Heading 2", icon: <Heading2 className="w-4 h-4" />, description: "Medium section heading" },
    { type: "heading3", label: "Heading 3", icon: <Heading3 className="w-4 h-4" />, description: "Small section heading" },
    { type: "bold", label: "Bold Text", icon: <Bold className="w-4 h-4" />, description: "Make text bold" },
    { type: "bullet-list", label: "Bullet List", icon: <List className="w-4 h-4" />, description: "Create a bullet list" },
    { type: "numbered-list", label: "Numbered List", icon: <ListOrdered className="w-4 h-4" />, description: "Create a numbered list" },
    { type: "quote", label: "Quote", icon: <Quote className="w-4 h-4" />, description: "Add a quote block" },
    { type: "code", label: "Code Block", icon: <Code className="w-4 h-4" />, description: "Add a code snippet" },
    { type: "image", label: "Image", icon: <ImageIcon className="w-4 h-4" />, description: "Upload or embed an image" },
    { type: "urls", label: "Resources", icon: <Link className="w-4 h-4" />, description: "Add resource links" },
    { type: "divider", label: "Divider", icon: <Minus className="w-4 h-4" />, description: "Add a horizontal line" },
];

interface SlashCommandEditorProps {
    onChange: (content: string) => void;
}

const SlashCommandEditor = ({ onChange }: SlashCommandEditorProps): JSX.Element => {
    const [blocks, setBlocks] = useState<ContentBlock[]>([
        { id: crypto.randomUUID(), type: "paragraph", content: "", indent: 0 }
    ]);
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
    const [menuDirection, setMenuDirection] = useState<"up" | "down">("down");
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
    const [filterText, setFilterText] = useState("");
    const [showSelectionToolbar, setShowSelectionToolbar] = useState(false);
    const [selectionToolbarPosition, setSelectionToolbarPosition] = useState({ top: 0, left: 0 });
    const [selectedText, setSelectedText] = useState({ start: 0, end: 0 });
    const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageInputMode, setImageInputMode] = useState<"file" | "url">("file");
    const [imageUrlInput, setImageUrlInput] = useState("");
    const [imageModalBlockId, setImageModalBlockId] = useState<string | null>(null);
    const [showUrlModal, setShowUrlModal] = useState(false);
    const [urlModalBlockId, setUrlModalBlockId] = useState<string | null>(null);
    const [urlList, setUrlList] = useState<Array<{ title: string; url: string }>>([]);
    const [currentUrlTitle, setCurrentUrlTitle] = useState("");
    const [currentUrlValue, setCurrentUrlValue] = useState("");
    const editorRef = useRef<HTMLDivElement>(null);
    const inputRefs = useRef<Map<string, HTMLInputElement | HTMLTextAreaElement>>(new Map());
    const menuRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
    const fileInputRef = useRef<HTMLInputElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = slashOptions.filter(option =>
        option.label.toLowerCase().includes(filterText.toLowerCase())
    );

    // Check if current block is a list type
    const isListType = (type: BlockType) => type === "bullet-list" || type === "numbered-list";

    // Check if current block type exits on empty enter
    const exitsOnEmptyEnter = (type: BlockType) =>
        type === "bullet-list" || type === "numbered-list" || type === "quote" || type === "code";

    useEffect(() => {
        // Convert blocks to content string for parent component
        const contentString = blocks
            .map(block => {
                const indent = "  ".repeat(block.indent || 0);
                switch (block.type) {
                    case "heading1": return `# ${block.content}`;
                    case "heading2": return `## ${block.content}`;
                    case "heading3": return `### ${block.content}`;
                    case "bold": return `**${block.content}**`;
                    case "bullet-list": return `${indent}- ${block.content}`;
                    case "numbered-list": return `${indent}1. ${block.content}`;
                    case "quote": return `> ${block.content}`;
                    case "code": return `\`\`\`\n${block.content}\n\`\`\``;
                    case "image": return `![image](${block.content})`;
                    case "urls": return `[URLS]${block.content}[/URLS]`;
                    case "divider": return "---";
                    default: return block.content;
                }
            })
            .join("\n\n");
        onChange(contentString);
    }, [blocks, onChange]);

    // Handle text selection for formatting toolbar
    const handleSelect = (e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>, blockId: string) => {
        const input = e.target as HTMLInputElement | HTMLTextAreaElement;
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;

        if (end - start > 0) {
            const rect = input.getBoundingClientRect();
            const editorRect = editorRef.current?.getBoundingClientRect();
            if (editorRect) {
                setSelectionToolbarPosition({
                    top: rect.top - editorRect.top - 45,
                    left: rect.left - editorRect.left + (start * 8) // Approximate character position
                });
            }
            setSelectedText({ start, end });
            setShowSelectionToolbar(true);
        } else {
            setShowSelectionToolbar(false);
        }
    };

    const applyInlineFormat = (format: "bold" | "italic" | "underline" | "link") => {
        if (!activeBlockId) return;

        const block = blocks.find(b => b.id === activeBlockId);
        if (!block) return;

        const before = block.content.slice(0, selectedText.start);
        const selected = block.content.slice(selectedText.start, selectedText.end);
        const after = block.content.slice(selectedText.end);

        let formatted = "";
        switch (format) {
            case "bold":
                formatted = `**${selected}**`;
                break;
            case "italic":
                formatted = `*${selected}*`;
                break;
            case "underline":
                formatted = `<u>${selected}</u>`;
                break;
            case "link":
                formatted = `[${selected}](url)`;
                break;
        }

        setBlocks(prev => prev.map(b =>
            b.id === activeBlockId ? { ...b, content: before + formatted + after } : b
        ));
        setShowSelectionToolbar(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, blockId: string) => {
        const block = blocks.find(b => b.id === blockId);
        if (!block) return;
        const blockIndex = blocks.findIndex(b => b.id === blockId);

        if (showSlashMenu) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                const newIndex = (selectedOptionIndex + 1) % filteredOptions.length;
                setSelectedOptionIndex(newIndex);
                // Scroll into view
                setTimeout(() => {
                    optionRefs.current.get(newIndex)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
                }, 0);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const newIndex = (selectedOptionIndex - 1 + filteredOptions.length) % filteredOptions.length;
                setSelectedOptionIndex(newIndex);
                // Scroll into view
                setTimeout(() => {
                    optionRefs.current.get(newIndex)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
                }, 0);
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (filteredOptions[selectedOptionIndex]) {
                    selectOption(filteredOptions[selectedOptionIndex].type, blockId);
                }
            } else if (e.key === "Escape") {
                setShowSlashMenu(false);
                setFilterText("");
            }
            return;
        }

        // Handle Tab for indentation in lists
        if (e.key === "Tab" && isListType(block.type)) {
            e.preventDefault();
            const newIndent = e.shiftKey
                ? Math.max(0, (block.indent || 0) - 1)
                : Math.min(3, (block.indent || 0) + 1);
            setBlocks(prev => prev.map(b =>
                b.id === blockId ? { ...b, indent: newIndent } : b
            ));
            return;
        }

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            // Special handling for list types, quote, and code
            if (isListType(block.type)) {
                // If content is empty, exit list mode (double enter behavior)
                if (block.content.trim() === "") {
                    // Convert current block to paragraph
                    setBlocks(prev => prev.map(b =>
                        b.id === blockId ? { ...b, type: "paragraph", indent: 0 } : b
                    ));
                } else {
                    // Add new list item of the same type
                    addNewBlock(blockId, block.type, block.indent || 0);
                }
            } else if ((block.type === "quote" || block.type === "code") && block.content.trim() === "") {
                // Exit quote/code mode on empty enter
                setBlocks(prev => prev.map(b =>
                    b.id === blockId ? { ...b, type: "paragraph" } : b
                ));
            } else if (block.type === "code" && block.content.trim() !== "") {
                // For code blocks with content, add another code line
                addNewBlock(blockId, "code", 0);
            } else {
                addNewBlock(blockId);
            }
        } else if (e.key === "Backspace" && block.content === "") {
            e.preventDefault();

            // If it's a list with indent, reduce indent first
            if (isListType(block.type) && (block.indent || 0) > 0) {
                setBlocks(prev => prev.map(b =>
                    b.id === blockId ? { ...b, indent: (b.indent || 0) - 1 } : b
                ));
            } else if (block.type !== "paragraph" && blocks.length >= 1) {
                // Convert back to paragraph
                setBlocks(prev => prev.map(b =>
                    b.id === blockId ? { ...b, type: "paragraph", indent: 0 } : b
                ));
            } else if (blocks.length > 1) {
                removeBlock(blockId);
            }
        } else if (e.key === "Delete") {
            const input = e.target as HTMLInputElement;
            const cursorAtEnd = input.selectionStart === block.content.length && input.selectionEnd === block.content.length;

            // If cursor is at the end of the content, merge with next block or delete next empty block
            if (cursorAtEnd) {
                const nextBlock = blocks[blockIndex + 1];
                if (nextBlock) {
                    e.preventDefault();

                    if (nextBlock.type === "divider") {
                        // Remove the divider
                        setBlocks(prev => prev.filter(b => b.id !== nextBlock.id));
                    } else if (nextBlock.content === "" || nextBlock.type === "image") {
                        // Remove empty next block or image block
                        setBlocks(prev => prev.filter(b => b.id !== nextBlock.id));
                    } else {
                        // Merge next block's content into current block
                        setBlocks(prev => {
                            const newBlocks = prev.map(b => {
                                if (b.id === blockId) {
                                    return { ...b, content: b.content + nextBlock.content };
                                }
                                return b;
                            }).filter(b => b.id !== nextBlock.id);
                            return newBlocks;
                        });
                    }
                }
            }
        }
    };

    const handleInputChange = (value: string, blockId: string) => {
        const block = blocks.find(b => b.id === blockId);
        if (!block) return;

        // Hide selection toolbar on input change
        setShowSelectionToolbar(false);

        // Check for slash command
        if (value.endsWith("/")) {
            const inputEl = inputRefs.current.get(blockId);
            if (inputEl) {
                const rect = inputEl.getBoundingClientRect();
                const editorRect = editorRef.current?.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const menuHeight = 320; // max-h-80 = 320px
                const spaceBelow = viewportHeight - rect.bottom;
                const spaceAbove = rect.top;

                if (editorRect) {
                    // Determine if menu should appear above or below
                    if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
                        // Show menu above
                        setMenuDirection("up");
                        setSlashMenuPosition({
                            top: rect.top - editorRect.top - menuHeight - 4,
                            left: Math.max(0, rect.left - editorRect.left)
                        });
                    } else {
                        // Show menu below
                        setMenuDirection("down");
                        setSlashMenuPosition({
                            top: rect.bottom - editorRect.top + 4,
                            left: Math.max(0, rect.left - editorRect.left)
                        });
                    }
                }
            }
            setShowSlashMenu(true);
            setSelectedOptionIndex(0);
            setFilterText("");
            // Auto-focus search input when menu opens
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        } else if (showSlashMenu) {
            // Update filter text after slash
            const slashIndex = value.lastIndexOf("/");
            if (slashIndex !== -1) {
                setFilterText(value.slice(slashIndex + 1));
            } else {
                setShowSlashMenu(false);
                setFilterText("");
            }
        }

        setBlocks(prev => prev.map(b =>
            b.id === blockId ? { ...b, content: value.replace(/\/$/, "") } : b
        ));
    };

    // Handle image file selection - uploads to API and gets URL
    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>, blockId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show loading state
        setUploadingImages(prev => new Set(prev).add(blockId));

        try {
            // Create FormData for upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'blog-image');

            // Upload to API
            const response = await axios.post('/api/blogs/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const imageUrl = response.data.url;

            // Update block with the image URL
            const blockIndex = blocks.findIndex(b => b.id === blockId);
            const nextBlock = blocks[blockIndex + 1];
            const hasNextParagraph = nextBlock && nextBlock.type === "paragraph";

            if (hasNextParagraph) {
                setBlocks(prev => prev.map(b =>
                    b.id === blockId ? { ...b, content: imageUrl } : b
                ));
                setTimeout(() => {
                    inputRefs.current.get(nextBlock.id)?.focus();
                }, 100);
            } else {
                const newParagraphId = crypto.randomUUID();
                setBlocks(prev => {
                    const newBlocks = prev.map(b =>
                        b.id === blockId ? { ...b, content: imageUrl } : b
                    );
                    const idx = newBlocks.findIndex(b => b.id === blockId);
                    newBlocks.splice(idx + 1, 0, { id: newParagraphId, type: "paragraph", content: "", indent: 0 });
                    return newBlocks;
                });
                setTimeout(() => {
                    inputRefs.current.get(newParagraphId)?.focus();
                }, 100);
            }

            // Close modal after successful upload
            setShowImageModal(false);
            setImageUrlInput("");
        } catch (error) {
            console.error('Error uploading image:', error);
            // Fallback to base64 if API fails
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target?.result as string;
                const blockIndex = blocks.findIndex(b => b.id === blockId);
                const nextBlock = blocks[blockIndex + 1];
                const hasNextParagraph = nextBlock && nextBlock.type === "paragraph";

                if (hasNextParagraph) {
                    setBlocks(prev => prev.map(b =>
                        b.id === blockId ? { ...b, content: imageData } : b
                    ));
                    setTimeout(() => {
                        inputRefs.current.get(nextBlock.id)?.focus();
                    }, 100);
                } else {
                    const newParagraphId = crypto.randomUUID();
                    setBlocks(prev => {
                        const newBlocks = prev.map(b =>
                            b.id === blockId ? { ...b, content: imageData } : b
                        );
                        const idx = newBlocks.findIndex(b => b.id === blockId);
                        newBlocks.splice(idx + 1, 0, { id: newParagraphId, type: "paragraph", content: "", indent: 0 });
                        return newBlocks;
                    });
                    setTimeout(() => {
                        inputRefs.current.get(newParagraphId)?.focus();
                    }, 100);
                }
            };
            reader.readAsDataURL(file);
            
            // Close modal after fallback
            setShowImageModal(false);
            setImageUrlInput("");
        } finally {
            setUploadingImages(prev => {
                const newSet = new Set(prev);
                newSet.delete(blockId);
                return newSet;
            });
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Trigger image upload modal
    const triggerImageUpload = (blockId: string) => {
        setActiveBlockId(blockId);
        setImageModalBlockId(blockId);
        setShowImageModal(true);
        setImageInputMode("file");
        setImageUrlInput("");
    };

    // Handle URL image input
    const handleImageUrlSubmit = async () => {
        if (!imageUrlInput.trim() || !imageModalBlockId) return;

        setUploadingImages(prev => new Set(prev).add(imageModalBlockId));

        try {
            // Verify the URL is valid by trying to load the image
            const img = new Image();
            img.onload = () => {
                // URL is valid, update block with the image URL
                const blockIndex = blocks.findIndex(b => b.id === imageModalBlockId);
                const nextBlock = blocks[blockIndex + 1];
                const hasNextParagraph = nextBlock && nextBlock.type === "paragraph";

                if (hasNextParagraph) {
                    setBlocks(prev => prev.map(b =>
                        b.id === imageModalBlockId ? { ...b, content: imageUrlInput } : b
                    ));
                    setTimeout(() => {
                        inputRefs.current.get(nextBlock.id)?.focus();
                    }, 100);
                } else {
                    const newParagraphId = crypto.randomUUID();
                    setBlocks(prev => {
                        const newBlocks = prev.map(b =>
                            b.id === imageModalBlockId ? { ...b, content: imageUrlInput } : b
                        );
                        const idx = newBlocks.findIndex(b => b.id === imageModalBlockId);
                        newBlocks.splice(idx + 1, 0, { id: newParagraphId, type: "paragraph", content: "", indent: 0 });
                        return newBlocks;
                    });
                    setTimeout(() => {
                        inputRefs.current.get(newParagraphId)?.focus();
                    }, 100);
                }

                setShowImageModal(false);
                setImageUrlInput("");
                setUploadingImages(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(imageModalBlockId);
                    return newSet;
                });
            };
            img.onerror = () => {
                alert("Invalid image URL. Please check the URL and try again.");
                setUploadingImages(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(imageModalBlockId);
                    return newSet;
                });
            };
            img.src = imageUrlInput;
        } catch (error) {
            console.error('Error loading image from URL:', error);
            setUploadingImages(prev => {
                const newSet = new Set(prev);
                newSet.delete(imageModalBlockId);
                return newSet;
            });
        }
    };

    const selectOption = (type: BlockType, blockId: string) => {
        if (type === "divider") {
            // Insert divider and add new paragraph after it
            const blockIndex = blocks.findIndex(b => b.id === blockId);
            const newDividerId = crypto.randomUUID();
            const newParagraphId = crypto.randomUUID();

            setBlocks(prev => {
                const newBlocks = [...prev];
                newBlocks[blockIndex] = { ...newBlocks[blockIndex], content: newBlocks[blockIndex].content.replace(/\/$/, "") };
                newBlocks.splice(blockIndex + 1, 0,
                    { id: newDividerId, type: "divider", content: "", indent: 0 },
                    { id: newParagraphId, type: "paragraph", content: "", indent: 0 }
                );
                return newBlocks;
            });

            setTimeout(() => {
                inputRefs.current.get(newParagraphId)?.focus();
            }, 0);
        } else if (type === "image") {
            // For image, set block type and trigger file picker
            setBlocks(prev => prev.map(b =>
                b.id === blockId ? { ...b, type, content: b.content.replace(/\/$/, ""), indent: 0 } : b
            ));

            setTimeout(() => {
                triggerImageUpload(blockId);
            }, 100);
        } else if (type === "urls") {
            // For URLs, open modal to add resources
            setUrlModalBlockId(blockId);
            setUrlList([]);
            setCurrentUrlTitle("");
            setCurrentUrlValue("");
            setShowUrlModal(true);
            
            // Update block type
            setBlocks(prev => prev.map(b =>
                b.id === blockId ? { ...b, type, content: "", indent: 0 } : b
            ));
        } else {
            setBlocks(prev => prev.map(b =>
                b.id === blockId ? { ...b, type, content: b.content.replace(/\/$/, ""), indent: 0 } : b
            ));

            // Auto-focus on the input after selecting an option
            setTimeout(() => {
                inputRefs.current.get(blockId)?.focus();
            }, 0);
        }

        setShowSlashMenu(false);
        setFilterText("");
    };

    const addNewBlock = (afterBlockId: string, type: BlockType = "paragraph", indent: number = 0) => {
        const newId = crypto.randomUUID();
        const blockIndex = blocks.findIndex(b => b.id === afterBlockId);

        setBlocks(prev => {
            const newBlocks = [...prev];
            newBlocks.splice(blockIndex + 1, 0, { id: newId, type, content: "", indent });
            return newBlocks;
        });

        setTimeout(() => {
            inputRefs.current.get(newId)?.focus();
        }, 0);
    };

    const removeBlock = (blockId: string) => {
        const blockIndex = blocks.findIndex(b => b.id === blockId);
        const prevBlockId = blocks[blockIndex - 1]?.id;

        setBlocks(prev => prev.filter(b => b.id !== blockId));

        if (prevBlockId) {
            setTimeout(() => {
                const prevInput = inputRefs.current.get(prevBlockId);
                if (prevInput) {
                    prevInput.focus();
                    // Move cursor to end
                    const length = prevInput.value.length;
                    prevInput.setSelectionRange(length, length);
                }
            }, 0);
        }
    };

    // Handle adding a URL to the list
    const handleAddUrl = () => {
        if (!currentUrlTitle.trim() || !currentUrlValue.trim()) {
            alert("Please enter both title and URL");
            return;
        }

        // Validate URL
        try {
            new URL(currentUrlValue.trim());
        } catch {
            alert("Please enter a valid URL");
            return;
        }

        setUrlList([...urlList, { title: currentUrlTitle.trim(), url: currentUrlValue.trim() }]);
        setCurrentUrlTitle("");
        setCurrentUrlValue("");
    };

    // Handle removing a URL from the list
    const handleRemoveUrl = (index: number) => {
        setUrlList(urlList.filter((_, i) => i !== index));
    };

    // Handle saving URLs to the block
    const handleSaveUrls = () => {
        if (urlList.length === 0) {
            alert("Please add at least one URL");
            return;
        }

        if (!urlModalBlockId) return;

        // Format URLs as: title1|url1|||title2|url2
        const urlContent = urlList.map(item => `${item.title}|${item.url}`).join("|||");

        setBlocks(prev =>
            prev.map(b =>
                b.id === urlModalBlockId ? { ...b, content: urlContent } : b
            )
        );

        setShowUrlModal(false);
        setUrlList([]);
        setCurrentUrlTitle("");
        setCurrentUrlValue("");
    };

    // Get list number considering previous items of same type
    const getListNumber = (block: ContentBlock, index: number) => {
        let count = 1;
        for (let i = index - 1; i >= 0; i--) {
            if (blocks[i].type === "numbered-list" && blocks[i].indent === block.indent) {
                count++;
            } else if (blocks[i].type !== "numbered-list" || (blocks[i].indent || 0) < (block.indent || 0)) {
                break;
            }
        }
        return count;
    };

    const renderBlock = (block: ContentBlock, index: number) => {
        const baseClasses = "w-full bg-transparent focus:outline-none resize-none";
        const indentPadding = (block.indent || 0) * 24;

        if (block.type === "divider") {
            return <hr key={block.id} className="my-4 border-muted-foreground/20" />;
        }

        const getBlockStyles = () => {
            switch (block.type) {
                case "heading1":
                    return `${baseClasses} text-3xl sm:text-4xl font-bold min-h-[48px]`;
                case "heading2":
                    return `${baseClasses} text-2xl sm:text-3xl font-semibold min-h-[40px]`;
                case "heading3":
                    return `${baseClasses} text-xl sm:text-2xl font-medium min-h-[36px]`;
                case "bold":
                    return `${baseClasses} text-lg sm:text-xl font-bold min-h-[32px]`;
                case "bullet-list":
                case "numbered-list":
                    return `${baseClasses} text-lg sm:text-xl min-h-[32px]`;
                case "quote":
                    return `${baseClasses} text-lg sm:text-xl italic text-muted-foreground min-h-[32px]`;
                case "code":
                    return `${baseClasses} font-mono text-sm bg-muted/50 p-2 rounded min-h-[32px]`;
                case "image":
                    return `${baseClasses} text-sm text-muted-foreground`;
                case "urls":
                    return `${baseClasses} text-sm text-muted-foreground`;
                default:
                    return `${baseClasses} text-lg sm:text-xl leading-relaxed min-h-[32px]`;
            }
        };

        const getPlaceholder = () => {
            // Only show placeholder for the active/focused block or the first block
            const isFirstBlock = index === 0;
            const isActive = block.id === activeBlockId;

            // For paragraph blocks, only show placeholder if it's the first block or currently focused
            if (block.type === "paragraph" && !isFirstBlock && !isActive) {
                return "";
            }

            switch (block.type) {
                case "heading1": return "Heading 1";
                case "heading2": return "Heading 2";
                case "heading3": return "Heading 3";
                case "bold": return "Bold text";
                case "bullet-list": return "List item (Enter for next, empty Enter to exit)";
                case "numbered-list": return "List item (Enter for next, empty Enter to exit)";
                case "quote": return "Quote (empty Enter to exit)";
                case "code": return "Code (empty Enter to exit)";
                case "image": return "Click to upload image...";
                case "urls": return "Resources will be displayed here";
                default: return "Type '/' for commands...";
            }
        };

        const getPrefix = () => {
            switch (block.type) {
                case "bullet-list": return "•";
                case "numbered-list": return `${getListNumber(block, index)}.`;
                default: return "";
            }
        };

        const prefix = getPrefix();

        return (
            <div
                key={block.id}
                className={`flex items-start gap-2 ${block.type === "quote" ? "border-l-4 border-muted-foreground/30 pl-4" : ""}`}
                style={{ paddingLeft: indentPadding }}
            >
                {prefix && (
                    <span className="text-lg sm:text-xl text-muted-foreground min-w-[20px] text-right">
                        {prefix}
                    </span>
                )}
                {block.type === "image" ? (
                    <div className="w-full flex-1 flex justify-center">
                        {uploadingImages.has(block.id) ? (
                            <div className="w-full p-8 border-2 border-dashed border-primary/50 rounded-lg flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm">Uploading image...</span>
                            </div>
                        ) : block.content ? (
                            <div className="relative group inline-block">
                                <img src={block.content} alt="Uploaded" className="max-w-full h-auto rounded-lg mx-auto" />
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => triggerImageUpload(block.id)}
                                        className="bg-background/80 backdrop-blur-sm hover:bg-background p-2 rounded-lg shadow-lg border border-border/30"
                                        title="Replace image"
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (blocks.length > 1) {
                                                removeBlock(block.id);
                                            } else {
                                                // If it's the only block, just clear the image
                                                setBlocks(prev => prev.map(b =>
                                                    b.id === block.id ? { ...b, type: "paragraph", content: "" } : b
                                                ));
                                            }
                                        }}
                                        className="bg-destructive/80 backdrop-blur-sm hover:bg-destructive p-2 rounded-lg shadow-lg border border-destructive/30 text-destructive-foreground"
                                        title="Remove image"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full space-y-3 rounded-lg border-2 border-dashed border-muted-foreground/30 p-6 relative group">
                                {/* Delete Button */}
                                <button
                                    onClick={() => {
                                        if (blocks.length > 1) {
                                            removeBlock(block.id);
                                        } else {
                                            setBlocks(prev => prev.map(b =>
                                                b.id === block.id ? { ...b, type: "paragraph", content: "" } : b
                                            ));
                                        }
                                    }}
                                    className="absolute top-2 right-2 p-2 bg-destructive/80 hover:bg-destructive text-destructive-foreground rounded-lg shadow-lg border border-destructive/30 transition-all opacity-0 group-hover:opacity-100"
                                    title="Remove image block"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                {/* Upload Button */}
                                <button
                                    onClick={() => triggerImageUpload(block.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            triggerImageUpload(block.id);
                                        }
                                    }}
                                    onFocus={() => setActiveBlockId(block.id)}
                                    className="w-full p-6 rounded-lg hover:bg-primary/5 focus:bg-primary/10 focus:outline-none transition-colors flex flex-col items-center gap-2 text-muted-foreground hover:text-primary"
                                >
                                    <ImageIcon className="w-8 h-8" />
                                    <span className="text-sm font-medium">Click to upload image</span>
                                </button>

                                {/* URL Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Or paste image URL:</label>
                                    <input
                                        type="text"
                                        placeholder="https://example.com/image.jpg"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                                                const url = e.currentTarget.value.trim();
                                                const blockIndex = blocks.findIndex(b => b.id === block.id);
                                                const nextBlock = blocks[blockIndex + 1];
                                                const hasNextParagraph = nextBlock && nextBlock.type === "paragraph";

                                                if (hasNextParagraph) {
                                                    setBlocks(prev => prev.map(b =>
                                                        b.id === block.id ? { ...b, content: url } : b
                                                    ));
                                                    setTimeout(() => {
                                                        inputRefs.current.get(nextBlock.id)?.focus();
                                                    }, 100);
                                                } else {
                                                    const newParagraphId = crypto.randomUUID();
                                                    setBlocks(prev => {
                                                        const newBlocks = prev.map(b =>
                                                            b.id === block.id ? { ...b, content: url } : b
                                                        );
                                                        const idx = newBlocks.findIndex(b => b.id === block.id);
                                                        newBlocks.splice(idx + 1, 0, { id: newParagraphId, type: "paragraph", content: "", indent: 0 });
                                                        return newBlocks;
                                                    });
                                                    setTimeout(() => {
                                                        inputRefs.current.get(newParagraphId)?.focus();
                                                    }, 100);
                                                }
                                                e.currentTarget.value = "";
                                            }
                                        }}
                                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-background text-foreground placeholder:text-muted-foreground/50"
                                    />
                                    <p className="text-xs text-muted-foreground">Press Enter to add image from URL</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : block.type === "urls" ? (
                    <div className="w-full flex-1">
                        {block.content ? (
                            <div className="space-y-2">
                                {block.content.split("|||").map((item, idx) => {
                                    const [title, url] = item.split("|");
                                    return (
                                        <a
                                            key={idx}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm text-primary hover:text-primary/80"
                                        >
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            <span className="truncate flex-1">{title}</span>
                                            <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-4 text-center rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 text-muted-foreground text-sm">
                                <p>Click the edit button to add resources</p>
                            </div>
                        )}
                        <button
                            onClick={() => {
                                setUrlModalBlockId(block.id);
                                const urls = block.content.split("|||").map(item => {
                                    const [title, url] = item.split("|");
                                    return { title, url };
                                }).filter(u => u.title && u.url);
                                setUrlList(urls);
                                setCurrentUrlTitle("");
                                setCurrentUrlValue("");
                                setShowUrlModal(true);
                            }}
                            className="mt-2 px-3 py-2 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors border border-primary/30"
                        >
                            Edit Resources
                        </button>
                    </div>
                ) : (
                    <textarea
                        ref={el => { if (el) inputRefs.current.set(block.id, el); }}
                        value={block.content}
                        onChange={(e) => {
                            handleInputChange(e.target.value, block.id);
                            // Auto-resize textarea
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onKeyDown={(e) => handleKeyDown(e, block.id)}
                        onFocus={(e) => {
                            setActiveBlockId(block.id);
                            // Auto-resize on focus
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onSelect={(e) => handleSelect(e, block.id)}
                        onBlur={() => setTimeout(() => setShowSelectionToolbar(false), 200)}
                        placeholder={getPlaceholder()}
                        rows={1}
                        className={`${getBlockStyles()} placeholder:text-muted-foreground/40 flex-1 resize-none overflow-hidden`}
                    />
                )}
            </div>
        );
    };

    return (
        <div ref={editorRef} className="relative min-h-[60vh]">
            {/* Hidden file input for image upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => activeBlockId && handleImageSelect(e, activeBlockId)}
            />

            <div className="space-y-2">
                {blocks.map((block, index) => renderBlock(block, index))}
            </div>

            {/* Image Upload Modal */}
            {showImageModal && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
                        onClick={() => {
                            setShowImageModal(false);
                            setImageUrlInput("");
                        }}
                    />
                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto">
                            {/* Header */}
                            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card/95 backdrop-blur-sm">
                                <h2 className="text-xl font-semibold">Add Image</h2>
                                <button
                                    onClick={() => {
                                        setShowImageModal(false);
                                        setImageUrlInput("");
                                    }}
                                    className="p-1 hover:bg-accent rounded-lg transition-colors"
                                    title="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Tab Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setImageInputMode("file");
                                            setImageUrlInput("");
                                        }}
                                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                                            imageInputMode === "file"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        }`}
                                    >
                                        <ImageIcon className="inline-block w-4 h-4 mr-2" />
                                        Upload File
                                    </button>
                                    <button
                                        onClick={() => {
                                            setImageInputMode("url");
                                            setImageUrlInput("");
                                        }}
                                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                                            imageInputMode === "url"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        }`}
                                    >
                                        <Link className="inline-block w-4 h-4 mr-2" />
                                        From URL
                                    </button>
                                </div>

                                {/* File Upload Mode */}
                                {imageInputMode === "file" && (
                                    <div className="space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            Choose an image file from your computer
                                        </p>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center gap-2 text-muted-foreground hover:text-primary"
                                        >
                                            <ImageIcon className="w-8 h-8" />
                                            <span className="text-sm font-medium">Click to select image</span>
                                            <span className="text-xs">or drag and drop</span>
                                        </button>
                                    </div>
                                )}

                                {/* URL Input Mode */}
                                {imageInputMode === "url" && (
                                    <div className="space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            Paste the URL of your image
                                        </p>
                                        <input
                                            type="text"
                                            value={imageUrlInput}
                                            onChange={(e) => setImageUrlInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleImageUrlSubmit();
                                                }
                                            }}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 flex gap-3 p-6 border-t border-border bg-card/95 backdrop-blur-sm">
                                <button
                                    onClick={() => {
                                        setShowImageModal(false);
                                        setImageUrlInput("");
                                    }}
                                    className="flex-1 py-2 px-4 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                {imageInputMode === "url" && (
                                    <button
                                        onClick={handleImageUrlSubmit}
                                        disabled={!imageUrlInput.trim() || uploadingImages.has(imageModalBlockId || "")}
                                        className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                    >
                                        {uploadingImages.has(imageModalBlockId || "") ? "Loading..." : "Upload"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* URL Resources Modal */}
            {showUrlModal && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
                        onClick={() => {
                            setShowUrlModal(false);
                            setUrlList([]);
                            setCurrentUrlTitle("");
                            setCurrentUrlValue("");
                        }}
                    />
                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-card border border-border rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card/95 backdrop-blur-sm">
                                <h2 className="text-lg font-semibold text-foreground">Add Resources</h2>
                                <button
                                    onClick={() => {
                                        setShowUrlModal(false);
                                        setUrlList([]);
                                        setCurrentUrlTitle("");
                                        setCurrentUrlValue("");
                                    }}
                                    className="p-1 hover:bg-accent rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {/* Add URL Form */}
                                <div className="space-y-4 pb-4 border-b border-border">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={currentUrlTitle}
                                            onChange={(e) => setCurrentUrlTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleAddUrl();
                                                }
                                            }}
                                            placeholder="e.g., GitHub Repository"
                                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-background text-foreground placeholder:text-muted-foreground/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">URL</label>
                                        <input
                                            type="text"
                                            value={currentUrlValue}
                                            onChange={(e) => setCurrentUrlValue(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleAddUrl();
                                                }
                                            }}
                                            placeholder="https://example.com"
                                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-background text-foreground placeholder:text-muted-foreground/50"
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddUrl}
                                        className="w-full px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors border border-primary/30 font-medium"
                                    >
                                        Add Resource
                                    </button>
                                </div>

                                {/* URLs List */}
                                {urlList.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-foreground">Resources ({urlList.length})</h3>
                                        {urlList.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{item.url}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveUrl(idx)}
                                                    className="ml-2 p-1 hover:bg-destructive/20 text-destructive rounded-lg transition-colors flex-shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 flex gap-3 p-6 border-t border-border bg-card/95 backdrop-blur-sm">
                                <button
                                    onClick={() => {
                                        setShowUrlModal(false);
                                        setUrlList([]);
                                        setCurrentUrlTitle("");
                                        setCurrentUrlValue("");
                                    }}
                                    className="flex-1 py-2 px-4 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveUrls}
                                    disabled={urlList.length === 0}
                                    className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    Save Resources
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Selection Formatting Toolbar */}
            {showSelectionToolbar && (
                <div
                    className="absolute z-50 flex items-center gap-1 bg-popover border border-border rounded-lg shadow-lg p-1"
                    style={{ top: selectionToolbarPosition.top, left: selectionToolbarPosition.left }}
                >
                    <button
                        onClick={() => applyInlineFormat("bold")}
                        className="p-2 hover:bg-accent rounded transition-colors"
                        title="Bold"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => applyInlineFormat("italic")}
                        className="p-2 hover:bg-accent rounded transition-colors"
                        title="Italic"
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => applyInlineFormat("underline")}
                        className="p-2 hover:bg-accent rounded transition-colors"
                        title="Underline"
                    >
                        <Underline className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => applyInlineFormat("link")}
                        className="p-2 hover:bg-accent rounded transition-colors"
                        title="Add Link"
                    >
                        <Link className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Slash Command Menu with Backdrop */}
            {showSlashMenu && (
                <>
                    {/* Backdrop overlay */}
                    <div
                        className="fixed inset-0 bg-background/40 backdrop-blur-sm z-40 animate-in fade-in-0"
                        style={{ animationDuration: "100ms" }}
                        onClick={() => {
                            setShowSlashMenu(false);
                            setFilterText("");
                            if (activeBlockId) {
                                inputRefs.current.get(activeBlockId)?.focus();
                            }
                        }}
                    />
                    <div
                        ref={menuRef}
                        className={`absolute z-50 bg-popover/90 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl w-80 max-h-[400px] overflow-hidden ring-1 ring-white/10 ${menuDirection === "up" ? "animate-in slide-in-from-bottom-2 fade-in-0" : "animate-in slide-in-from-top-2 fade-in-0"
                            }`}
                        style={
                            {
                                top: slashMenuPosition.top,
                                left: slashMenuPosition.left,
                                animationDuration: "150ms"
                            }}
                    >
                        {/* Search Input */}
                        <div className="p-2 border-b border-border/30">
                            <div className="relative">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={filterText}
                                    onChange={(e) => {
                                        setFilterText(e.target.value);
                                        setSelectedOptionIndex(0);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "ArrowDown") {
                                            e.preventDefault();
                                            const newIndex = (selectedOptionIndex + 1) % filteredOptions.length;
                                            setSelectedOptionIndex(newIndex);
                                            setTimeout(() => {
                                                optionRefs.current.get(newIndex)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
                                            }, 0);
                                        } else if (e.key === "ArrowUp") {
                                            e.preventDefault();
                                            const newIndex = (selectedOptionIndex - 1 + filteredOptions.length) % filteredOptions.length;
                                            setSelectedOptionIndex(newIndex);
                                            setTimeout(() => {
                                                optionRefs.current.get(newIndex)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
                                            }, 0);
                                        } else if (e.key === "Enter") {
                                            e.preventDefault();
                                            if (filteredOptions[selectedOptionIndex] && activeBlockId) {
                                                selectOption(filteredOptions[selectedOptionIndex].type, activeBlockId);
                                            }
                                        } else if (e.key === "Escape") {
                                            setShowSlashMenu(false);
                                            setFilterText("");
                                            // Return focus to the active block
                                            if (activeBlockId) {
                                                inputRefs.current.get(activeBlockId)?.focus();
                                            }
                                        }
                                    }}
                                    placeholder="Search blocks..."
                                    className="w-full bg-muted/50 border border-border/30 rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                                />
                                {filterText && (
                                    <button
                                        onClick={() => {
                                            setFilterText("");
                                            searchInputRef.current?.focus();
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                                    >
                                        <span className="text-xs">✕</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Options List */}
                        <div className="overflow-y-auto max-h-[280px] scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                            {filteredOptions.length > 0 ? (
                                <>
                                    <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                                        Basic Blocks
                                    </div>
                                    <div className="px-1 pb-1">
                                        {filteredOptions.map((option, index) => (
                                            <button
                                                key={option.type}
                                                ref={el => { if (el) optionRefs.current.set(index, el); }}
                                                onClick={() => activeBlockId && selectOption(option.type, activeBlockId)}
                                                className={`w-full flex items-center gap-3 px-2 py-2.5 text-left rounded-lg transition-all duration-150 ${index === selectedOptionIndex
                                                    ? "bg-accent shadow-sm"
                                                    : "hover:bg-accent/50"
                                                    }`}
                                            >
                                                <div className={`flex items-center justify-center w-11 h-11 rounded-lg border transition-colors ${index === selectedOptionIndex
                                                    ? "border-primary/30 bg-primary/10 text-primary"
                                                    : "border-border/50 bg-background/80"
                                                    }`}>
                                                    {option.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm">{option.label}</div>
                                                    <div className="text-xs text-muted-foreground/70 truncate">{option.description}</div>
                                                </div>
                                                {index === selectedOptionIndex && (
                                                    <div className="text-[10px] text-muted-foreground/50 bg-muted/50 px-1.5 py-0.5 rounded">
                                                        Enter
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="px-3 py-8 text-center text-sm text-muted-foreground/70">
                                    No blocks found for "{filterText}"
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-3 py-2 border-t border-border/30 text-[10px] text-muted-foreground/50 flex items-center gap-2">
                            <span className="bg-muted/50 px-1.5 py-0.5 rounded">↑↓</span> navigate
                            <span className="bg-muted/50 px-1.5 py-0.5 rounded">↵</span> select
                            <span className="bg-muted/50 px-1.5 py-0.5 rounded">esc</span> close
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default function NewBlogPage() {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Extract first image URL from content
    const extractFirstImage = (content: string): string | null => {
        const imageMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        return imageMatch ? imageMatch[2] : null;
    };

    // Check if content has at least one image
    const hasImage = (content: string): boolean => {
        return /!\[([^\]]*)\]\([^)]+\)/.test(content);
    };

    const handleSubmit = async () => {
        if (!title || !content) return;

        // Check for at least one image
        if (!hasImage(content)) {
            setError("Please add at least one image to your blog post.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const bannerImage = extractFirstImage(content);

        const blog = {
            title,
            subTitle: subtitle,
            contents: content,
            is_premium: false,
            banner_image: bannerImage,
        };

        ///submit to API
        try {
            const response = await axios.post('/api/blogs', blog) as AxiosResponse<{ data: Blog; isError: boolean; error?: string }>;
            window.location.href = `/blogs/${response.data.data.id}`;
        } catch (error) {
            console.error('Error creating blog:', error);
            setError("Failed to create blog. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    return (
        <div className="min-h-screen bg-background py-0 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-80">
                    {/* Title */}
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                        className="w-full bg-transparent text-4xl sm:text-5xl font-bold placeholder:text-muted-foreground/40 focus:outline-none mb-4"
                    />

                    {/* Subtitle */}
                    <input
                        type="text"
                        placeholder="Add a subtitle..."
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                        className="w-full bg-transparent text-xl sm:text-2xl text-muted-foreground placeholder:text-muted-foreground/40 focus:outline-none mb-8"
                    />
                    {/* Text Area with Custom Testing */}
                    <SlashCommandEditor onChange={setContent} />

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    {/* Bottom Bar */}
                    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm py-4 px-4 sm:px-6 border-t border-border/50">
                        <div className="max-w-3xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                    {wordCount} {wordCount === 1 ? "word" : "words"}
                                </span>
                                {!hasImage(content) && content.length > 0 && (
                                    <span className="text-xs text-amber-500 flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Add an image
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        // TODO: Save as draft
                                        console.log("Save as draft");
                                    }}
                                >
                                    Save draft
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    disabled={isSubmitting || !title || !content || !hasImage(content)}
                                    className="rounded-full px-6"
                                    onClick={handleSubmit}
                                >
                                    {isSubmitting ? "Publishing..." : "Publish"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

#!/bin/bash

# source directory
src_dir="Copy Queue Test"

# destination directory
dst_dir="Copy Queue Test Destination"

mkdir -p "$src_dir/Documents/Receipts"
echo "This is a report" > "$src_dir/Documents/Report.docx"
echo "Receipt for January" > "$src_dir/Documents/Receipts/Receipt-Jan.pdf"
echo "Receipt for February" > "$src_dir/Documents/Receipts/Receipt-Feb.pdf"
echo "Receipt for March" > "$src_dir/Documents/Receipts/Receipt-Mar.pdf"
mkdir -p "$src_dir/Documents/Letters"
echo "This is letter 1" > "$src_dir/Documents/Letters/Letter1.docx"
echo "This is letter 2" > "$src_dir/Documents/Letters/Letter2.docx"

mkdir -p "$src_dir/Pictures/Vacation"
echo "Picture from Italy" > "$src_dir/Pictures/Vacation/Italy.jpg"
echo "Picture from Spain" > "$src_dir/Pictures/Vacation/Spain.jpg"
echo "Picture from France" > "$src_dir/Pictures/Vacation/France.jpg"
mkdir -p "$src_dir/Pictures/Family"
echo "Picture from Birthday" > "$src_dir/Pictures/Family/Birthday.jpg"
echo "Picture from Christmas" > "$src_dir/Pictures/Family/Christmas.jpg"

mkdir -p "$src_dir/Music/Rock"
echo "This is Rock Track 1" > "$src_dir/Music/Rock/Track1.mp3"
echo "This is Rock Track 2" > "$src_dir/Music/Rock/Track2.mp3"
mkdir -p "$src_dir/Music/Classical"
echo "This is Classical Track A" > "$src_dir/Music/Classical/TrackA.mp3"
echo "This is Classical Track B" > "$src_dir/Music/Classical/TrackB.mp3"

mkdir -p "$src_dir/Videos"
echo "This is Birthday Party Video" > "$src_dir/Videos/BirthdayParty.mp4"
echo "This is Vacation Video" > "$src_dir/Videos/Vacation.mp4"

# create the destination directory
mkdir -p "$dst_dir"

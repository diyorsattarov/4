import cv2

# Load the image
image_path = 'product.png'
base_image = cv2.imread(image_path)

# Check if the image has been correctly loaded
if base_image is None:
    raise FileNotFoundError('Image not found at the specified path.')

# Define font, scale, and thickness
font = cv2.FONT_HERSHEY_SIMPLEX
scale = 1
thickness = 2
color = (0, 0, 0)  # Black color

for i in range(25):
    # Clone the original image to draw on
    img_with_number = base_image.copy()
    
    # Define the number as text
    text = str(i)
    
    # Get the width and height of the text box
    text_size = cv2.getTextSize(text, font, scale, thickness)[0]
    
    # Calculate the center coordinates of the image
    text_x = (img_with_number.shape[1] - text_size[0]) // 2
    text_y = (img_with_number.shape[0] + text_size[1]) // 2
    
    # Put the number in the center of the image
    cv2.putText(img_with_number, text, (text_x, text_y), font, scale, color, thickness)
    
    # Save the image
    output_path = f'product_{i+1}.png'
    cv2.imwrite(output_path, img_with_number)

    print(f'Saved: {output_path}')

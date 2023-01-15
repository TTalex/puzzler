import cv2
import os
cols = 7
rows = 2
img = cv2.imread('src.png')
folder = "../data/8"
if not os.path.exists(folder):
    os.makedirs(folder)
i = 1
for r in range(0,rows):
    for c in range(0,cols):
        cv2.imwrite(
            f"{folder}/{i}.png",
            img[
                round(r*(img.shape[0]/rows)):round((r+1)*(img.shape[0]/rows)),
                round(c*(img.shape[1]/cols)):round((c+1)*(img.shape[1]/cols)),
                :
            ])
        i = i + 1

os.rename('src.png', f"{folder}/src.png")

print(f'''
    cols: {cols},
    rows: {rows},
    spacing: 0,
    tiles: setStandardTiles("{folder[2:]}", {cols}, {rows}),
    srcImageAspectRatio: {round(img.shape[1] / img.shape[0], 1)}
''')

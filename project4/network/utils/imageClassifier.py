import torch
import numpy
import torchvision
import urllib
from PIL import Image
from torchvision import transforms


def is_doggo(image):
    model = torchvision.models.segmentation.deeplabv3_resnet50(pretrained=True)
    model.eval()
    input_image = Image.open(image)
    preprocess = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    input_tensor = preprocess(input_image)
    input_batch = input_tensor.unsqueeze(0)

    if torch.cuda.is_available():
        input_batch = input_batch.to('cuda')
        model.to('cuda')

    with torch.no_grad():
        output = model(input_batch)['out'][0]
    output_predictions = output.argmax(0)
    a = output_predictions.byte().cpu().numpy()
    unique, counts = numpy.unique(a, return_counts=True)
    pixels = dict(zip(unique, counts))
    dog_pixels = pixels.get(12, 0)
    return (dog_pixels/a.size)*100 > 5

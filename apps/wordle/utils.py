from typing import List, Dict
import random


def get_word_list(path) -> List[str]:
    """ Returns a list of words from a given filepath """
    with open(path, 'r') as file:
        word_ls = [w.strip() for w in file.readlines()]

    return word_ls


def get_user_name() -> str:
    """Returns the Name of the User"""

    while True:
        user_name = input("Enter your name >>> ")

        if not user_name.isalpha() or len(user_name.strip()) == 0:
            print("Invalid Name! Please try again ...\n")
            continue
        else:
            return user_name.strip()


def generate_jumbled_hint(word: str) -> str:
    """Generate a Hint for the Target Word by Shuffling the Characters"""
    char_list = list(word)
    random.shuffle(char_list)
    return ''.join(char_list)


def get_user_word(target_word: str, valid_words: List[str], check_all_words: bool = False) -> str:
    """ Prompts User for Valid Guess Word and Returns that Word """
    # Prompt the user for their guess word and check if valid
    target_word_len = len(target_word)
    print(f"What is your {target_word_len}-letter guess? [Hint (Shuffle): {generate_jumbled_hint(target_word)}]")
    while True:
        try:
            user_word = input(">>> ")  # User's Guess

            # https://nadeauinnovations.com/post/2020/11/python-tricks-replace-all-non-alphanumeric-characters-in-a-string/
            is_all_alpha = all([character.isalpha() for character in user_word])

            user_word = user_word.lower()  # Standardized to Lowercase
            user_word = user_word.strip().replace(" ", "")  # Strip the User Guess Word string

            if not is_all_alpha:
                print("The guess word cannot have any numeric characters! Please try again...")
                continue

            if len(user_word) > target_word_len:
                print(f"The number of letters cannot exceed the number of letters in the target word "
                      f"({target_word_len} letters)! Please try again ...")
                continue

            if len(user_word) < target_word_len:
                print(f"The number of letters cannot be less than the number of letters in the target word "
                      f"({target_word_len} letters)! Please try again ...")
                continue

            if check_all_words:
                if user_word not in valid_words:
                    print(f"Your word is meaningless! Please try again ...")
                    continue

            return user_word

        except Exception as err:
            print(err)
            continue


def get_user_bool(true_value: str, false_value: str, message: str) -> bool:
    """Returns True or False corresponding to User's Input"""
    assert true_value != false_value, "True Value cannot be the same as False Value!"

    while True:
        try:
            user_input = input(f"{message} >>> ")
            user_input = user_input.replace(" ", "")
            if user_input in [true_value, false_value]:
                return user_input == true_value
            else:
                print(f"Your input is invalid. Please select from ['{true_value}', '{false_value}'].\n")
                continue

        except Exception as e:
            print(e)
            continue


def get_difficulty_level() -> int:
    """Returns the number of attempts based from the chosen difficulty level"""

    while True:
        difficulty_level = input("Select Difficulty Level (easy/normal/hard) >>> ")
        if difficulty_level in ['easy', 'normal', 'hard']:
            match difficulty_level:
                case 'easy':
                    return 10
                case 'normal':
                    return 6
                case 'hard':
                    return 4
        else:
            print("Invalid Difficulty! Please try again ...\n")
            continue


def count_letters(word: str) -> Dict[str, int]:
    """ Returns a Dictionary of the Letter/Character Counts in the given Word

    >>> count_letters("cedric")
    {'c': 2, 'e': 1, 'd': 1, 'r': 1, 'i': 1}

    >>> count_letters("aaaaa")
    {'a': 5}
    """

    out_dict = {}

    for letter in word:
        if letter not in out_dict.keys():
            out_dict[letter] = 1
        else:
            out_dict[letter] += 1

    return out_dict


def num_letter_in_word(letter: str, word: str) -> int:
    """Returns the number of occurences of a letter in a given word

    >>> num_letter_in_word('c', 'cedric')
    2

    >>> num_letter_in_word('a', 'aaaaa')
    5

    >>> num_letter_in_word('b', 'cedric')
    0
    """
    assert len(letter) == 1, "letter must be a string with length 1"
    return count_letters(word).get(letter, 0)


def num_hits(guess: str, target: str) -> int:
    """Returns the Number of Hits

    >>> num_hits('hello', 'world')
    1

    >>> num_hits('LLOIL', 'LLLLP')
    2

    >>> num_hits('TGULLL', 'LLLRFO')
    0
    """
    assert len(guess) == len(target), "Length of Target and Guess Strings must be Equal"
    return len([tup for tup in zip(guess, target) if tup[0] == tup[1]])


def num_bullets(letter: str, guess: str, target: str) -> int:
    """Returns the (initial static) number of Bullets

    >>> num_bullets('C', 'ECCCC', 'CRANK')
    1

    >>> num_bullets('L', 'LLLLUL', 'LELILL')
    1

    >>> num_bullets('L', 'TGULLL', 'LLLRFO')
    0

    >>> num_bullets('L', 'CRANK', 'ECCCC')
    0
    """

    n_letter_guess = num_letter_in_word(letter, guess)
    n_letter_target = num_letter_in_word(letter, target)

    if n_letter_target >= n_letter_guess:
        return 0
    else:
        return n_letter_target - num_hits(guess, target)


def is_cheat_at_letter(user_word: str, target_word: str, letter: str) -> bool:
    """

    >>> is_cheat_at_letter('cedric', 'abcdef', 'c')
    True

    >>> is_cheat_at_letter('cedric', 'abccef', 'c')
    False

    >>> is_cheat_at_letter('cedric', 'abcccf', 'c')
    False

    >>> is_cheat_at_letter('aaaaa', 'aabbb', 'a')
    True

    >>> is_cheat_at_letter('aaaab', 'aabbb', 'b')
    False
    """

    guess = user_word.lower().strip()
    target = target_word.lower().strip()
    this_letter = letter.lower().strip()

    assert len(guess) == len(target), "The length of the User and Target Words must be equal"
    assert len(this_letter) == 1

    return num_letter_in_word(this_letter, guess) > num_letter_in_word(this_letter, target) and (
                this_letter in guess) and (this_letter in target)


def get_score(user_word: str, target_word: str) -> List[str]:
    """ Returns the List of Scores """
    # Standardized to Lower Case
    user_word = user_word.lower()
    target_word = target_word.lower()

    word_len = len(target_word)  # Length of Target/User Word. Don't want to recalculate.

    assert len(user_word) == word_len, "The length of the User and Target Words must be equal"

    score_ls = []  # Initialize Scores

    for i in range(word_len):
        if user_word[i] == target_word[i]:
            score_ls += ["+"]
        elif user_word[i] in target_word:
            score_ls += ["?"]
        else:
            score_ls += ["-"]

    return score_ls


def get_score_advanced(user_word: str, target_word: str) -> List[str]:
    # Standardized to Lower Case
    user_word = user_word.lower()
    target_word = target_word.lower()

    word_len = len(target_word)  # Length of Target/User Word. Don't want to recalculate.

    score_ls = [None] * word_len  # Initialize Scores

    # Fill up `+`s
    for i in range(word_len):
        if user_word[i] == target_word[i]:
            score_ls[i] = "+"

    # Fill up `-`s
    for i in range(word_len):
        if score_ls[i] is None and user_word[i] not in target_word:  # Only consider None
            score_ls[i] = "-"

    if all([(score is not None) for score in score_ls]):  # Return if all are filled
        return score_ls

    # Create a (Initial) Dictionary for the Number of "Bullets", which may updated for each iteration
    num_bullets_dict = {}
    for letter in user_word:
        num_bullets_dict[letter] = num_bullets(letter, user_word, target_word)

    # Fill up `?`s
    for i in range(word_len):
        if score_ls[i] is None:
            # Get Letters
            target_letter = target_word[i]
            user_letter = user_word[i]

            assert user_letter in target_word, "User letter does not exist in the Target Word!!!"
            assert target_letter != user_letter, "Both Target and User Letters are Equal!!!"

            # Get Counts
            user_letter_count = num_letter_in_word(user_letter, user_word)
            user_letter_count_target = num_letter_in_word(user_letter,
                                                          target_word)  # Count of User Guess Letter in Target Word.

            assert user_letter_count_target > 0, "User letter does not exist in Target Word!!!"

            # Scoring Criteria
            if user_letter_count == 1 and user_letter_count_target == 1:  # Letter exist but in wrong index
                score_ls[i] = "?"
            elif user_letter_count > 1 and user_letter_count_target == 1:  # The "Cheating" Scenario
                # Check how many bullets left
                if num_bullets_dict[user_letter] > 0:  # There's still some "bullets"
                    score_ls[i] = "?"
                    num_bullets_dict[user_letter] -= 1  # Update the number of bullets for the letter by decrementing
                else:
                    score_ls[i] = "-"
            elif user_letter_count == 1 and user_letter_count_target > 1:
                score_ls[i] = "?"
            else:  # user_letter_count > 1 and user_letter_count_target > 1
                if user_letter_count > user_letter_count_target:  # The "Cheating" Scenario
                    # Check how many bullets left
                    if num_bullets_dict[user_letter] > 0:  # There's still some "bullets"
                        score_ls[i] = "?"
                        num_bullets_dict[
                            user_letter] -= 1  # Update the number of bullets for the letter by decrementing
                    else:
                        score_ls[i] = "-"
                else:
                    score_ls[i] = "?"  # There's a Theorem for this, but is left as an excercise for the reader ;)

    return score_ls


def did_user_win(score_ls) -> bool:
    """ Returns True of the User Correctly Guessed the Target Word, Otherwise False

    >>> did_user_win(['+', '+', '+'])
    True

    >>> did_user_win(['-', '-', '-'])
    False

    >>> did_user_win(['?', '?', '?'])
    False

    >>> did_user_win(['+', '-', '?'])
    False
    """
    return all([(True if score == "+" else False) for score in score_ls])


__all__ = ["get_word_list",
           "get_user_word",
           "get_user_bool",
           "get_score",
           "get_score_advanced",
           "did_user_win",
           "is_cheat_at_letter",
           "get_difficulty_level",
           "get_user_name"
           ]
